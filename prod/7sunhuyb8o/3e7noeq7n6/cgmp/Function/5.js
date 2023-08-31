module.exports = async (draft, { env, fn, dayjs, odata }) => {
  const searchType = draft.json.searchType;
  const searchCFJ = draft.json.confirmationJournal;
  let iStocks;
  /** conversion confirmationJournal by searchType */
  switch (searchType) {
    case "shippingDate": {
      const items = searchCFJ.map((cfj) => {
        const prodDate = cfj[env.CGMP_PROD_DATE];
        const postingDate = fn.convDate(dayjs, cfj.CBT_POSTING_DATE);
        return {
          materialID: cfj.CMATERIAL_UUID || "",
          fullName: cfj[env.CGMP_FULLNAME] || "",
          identifiedStockID: cfj.CISTOCK_UUID || "",
          identifiedStockText: cfj.TISTOCK_UUID || "",
          identifiedStockProductionDate: fn.convDate(dayjs, prodDate),
          originDocType: cfj.CREF_MST_TYPE || "", // 원본 문서 유형(생산 요청)
          realDeliveryDate: postingDate, // 실제 출고일
          deliveryDate: (() => {
            // 전기일 => 출고일
            if (!postingDate) return "";
            // 출고일 = 실제 출고일 + Working day 5
            return fn.addWeekdays(dayjs, postingDate, 5);
          })(),
          deliveryQuantity:
            Number(parseFloat(cfj.KCCONFIRMED_QUANTITY).toFixed(5)) || "",
          // 출고량
          deliveryQuantityUnit: cfj.UCINV_QUAN_NORMAL
            ? fn.unitCodeToKor(cfj.UCINV_QUAN_NORMAL).text
            : "",
          deliveryFromSiteID: cfj.CSITE_UUID || "",
          deliveryFromSiteName: cfj.TSITE_UUID || "",
        };
      });
      const outboundDeliveryItems = fn.uniqWith(items);
      draft.json.outboundDeliveryItems = outboundDeliveryItems;
      iStocks = outboundDeliveryItems.map((item) => item.identifiedStockID);
      draft.json.uploadKeys = iStocks.map((key) => ["98", key].join("/"));
      break;
    }
    case "productionDate": {
      const cfjs = searchCFJ.map((cfj) => {
        const postingDate = fn.convDate(dayjs, cfj.CBT_POSTING_DATE);
        return {
          materialID: cfj.CMATERIAL_UUID || "",
          fullName: cfj[env.CGMP_FULLNAME] || "",
          identifiedStockID: cfj.CISTOCK_UUID || "",
          identifiedStockText: cfj.TISTOCK_UUID || "",
          productionDate: postingDate, // 전기일(원본문서 생산요청이므로 생산일)
          productionSiteID: cfj.CSITE_UUID || "",
          productionSiteText: cfj.TSITE_UUID || "",
          originDocType: cfj.CREF_MST_TYPE || "", // 원본 문서 유형(생산 요청)
          productionQuantity:
            Number(parseFloat(cfj.KCCONFIRMED_QUANTITY).toFixed(5)) || "",
          // 확인된 수량 (원본문서 생산요청이므로 생산량)
          productionQuantityUnit: cfj.UCINV_QUAN_NORMAL
            ? fn.unitCodeToKor(cfj.UCINV_QUAN_NORMAL).text
            : "",
        };
      });

      const items = cfjs.map((item) => {
        const sameItems = cfjs.filter(
          (it) => it.identifiedStockID === item.identifiedStockID
        );
        const newItem = sameItems.reduce(
          (acc, curr) => {
            acc.productionQuantity =
              Math.round(
                (acc.productionQuantity + curr.productionQuantity) * 1000
              ) / 1000;
            return acc;
          },
          {
            productionQuantity: 0,
          }
        );
        return { ...item, ...newItem };
      });

      // const productionRequestItems = fn.uniqWith(items);
      const productionRequestItems = items;

      iStocks = [];
      for (let idx = 0; idx <= productionRequestItems.length; idx = idx + 15) {
        const iStockArr = productionRequestItems
          .slice(idx, idx + 15)
          .map((item) => item.identifiedStockID);
        iStocks.push(iStockArr);
      }
      draft.json.productionRequestItems = productionRequestItems;
      // iStocks = productionRequestItems.map((item) => item.identifiedStockID);
      const hashKey = new Date().valueOf().toString().substr(6);
      draft.json.uploadKeys = iStocks.map((key, idx) =>
        ["73", hashKey, idx].join("/")
      );
      break;
    }
    default:
      iStocks = [];
      break;
  }
  draft.json.iStocks = iStocks;
  draft.json.iStock_length = iStocks.length;
  draft.json.uploadKeyData = [];
  draft.response.body = {
    // productionRequestItems: draft.json.productionRequestItems,
    iStocks_leng: iStocks.length,
    searchCFJ_leng: searchCFJ.length,
    // iStocks
  };

  /** 항목 별 생산, 출하 정보 조회(Loop) */
  draft.json.reqCount = 0;
  draft.json.resCount = 0;
  const username = env.BYD_ID;
  const password = env.BYD_PASSWORD;
  // const flowID = "get_confirmationjournal";
  switch (searchType) {
    case "shippingDate": {
      const uploadKeyData = await Promise.all(
        iStocks.map((iStock) => {
          const queryString = fn.getQueryParams({
            params: {
              originalDocumentTypeCode: "98",
              identifiedStockID: iStock,
              select: [
                "CISTOCK_UUID,CREF_MST_TYPE,CBT_POSTING_DATE",
                "CSITE_UUID,TSITE_UUID",
                "KCCONFIRMED_QUANTITY,UCINV_QUAN_NORMAL",
              ].join(","),
            },
            env,
          });

          const url = [
            `${env.BYD_URL}/sap/byd/odata/cc_home_analytics.svc/`,
            "RPSCMCFJU01_Q0001QueryResults?",
            Object.keys(queryString)
              .map((key) => `${key}=${queryString[key]}`)
              .join("&"),
          ].join("");
          return fn
            .fetchAll(odata, { url, username, password })
            .then((cfjData) => {
              const confirmationJournal = cfjData.result;
              return confirmationJournal;
            });
        })
      );
      draft.json.uploadKeyData = uploadKeyData.flat();
      break;
    }
    case "productionDate": {
      let url;
      const uploadKeyData = await Promise.all(
        iStocks.map((iStock) => {
          const queryString = fn.getQueryParams({
            params: {
              refDocumentTypeCode: "73",
              identifiedStockID: iStock,
              // CINVCH_REASON: "14",
              // select: [
              //   "CISTOCK_UUID,CREF_TYPE,CBT_POSTING_DATE",
              //   "CMOVE_DIRECTION,CSITE_UUID,CINVCH_REASON",
              //   "KCCONFIRMED_QUANTITY,UCINV_QUAN_NORMAL",
              // ].join(","),
            },
            env,
          });

          url = [
            `${env.BYD_URL}/sap/byd/odata/cc_home_analytics.svc/`,
            "RPSCMCFJU01_Q0001QueryResults?",
            Object.keys(queryString)
              .map((key) => `${key}=${queryString[key]}`)
              .join("&"),
          ].join("");
          return fn
            .fetchAll(odata, { url, username, password })
            .then((cfjData) => {
              const confirmationJournal = cfjData.result;
              return confirmationJournal;
            })
            .catch((error) => {
              draft.response.body.error = error.message;
            });
        })
      );
      draft.json.uploadKeyData = uploadKeyData.flat();
      draft.response.body.url = url;
      // draft.response.body.uploadKeyData = uploadKeyData;
      // draft.json.loopBody = {
      //   flowID,
      //   resultUploadKey: fn.getKey({
      //     flowID,
      //     id: draft.json.uploadKeys[draft.json.reqCount],
      //     dateArr: request.requestTime,
      //   }),
      //   refDocumentTypeCode: "73",
      //   identifiedStockID: iStocks[draft.json.reqCount],
      //   select: [
      //     "CISTOCK_UUID,CREF_TYPE,CBT_POSTING_DATE",
      //     "CMOVE_DIRECTION,CSITE_UUID",
      //     "KCCONFIRMED_QUANTITY,UCINV_QUAN_NORMAL",
      //   ].join(","),
      // };
      break;
    }
    default:
      break;
  }
};
