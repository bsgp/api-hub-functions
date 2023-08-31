module.exports = async (draft, { dayjs, fn }) => {
  const searchType = draft.json.searchType;
  const uploadKeyData = draft.json.uploadKeyData;
  const getDetailCFJ = uploadKeyData;
  // uploadKeyData.forEach((cfj) => {
  //   data.forEach((cfj) => {
  //     // data.confirmationJournal.forEach((cfj) => {
  //     getDetailCFJ.push(cfj);
  //   });
  // });

  switch (searchType) {
    case "shippingDate": {
      const outboundDeliveryItems = draft.json.outboundDeliveryItems;
      const shippingDateList = outboundDeliveryItems.map((item) => {
        // identifiedStockID: cfj.CISTOCK_UUID
        const productionRequests = getDetailCFJ.filter(
          (cfj) => cfj.CISTOCK_UUID === item.identifiedStockID
        );
        if (productionRequests.length < 1) {
          const productionDate = (() => {
            const identProductionDate = item.identifiedStockProductionDate;
            if (identProductionDate) {
              return identProductionDate; // 동종재고 생산일
            } else {
              return item.realDeliveryDate
                ? fn.addWeekdays(dayjs, item.realDeliveryDate, -5)
                : "";
            }
          })();
          return {
            ...item,
            productionDate,
            productionSiteID: item.deliveryFromSiteID,
            productionSiteText: item.deliveryFromSiteName,
            productionQuantity: item.deliveryQuantity,
            productionQuantityUnit: item.deliveryQuantityUnit,
          };
        } else {
          // 전기일(원본문서 생산요청이므로 생산일)
          // 사이트ID(원본문서 생산요청이므로 생산 사이트)
          // 확인된 수량 (원본문서 생산요청이므로 생산량)
          const productionItem = productionRequests.reduce(
            (acc, curr) => {
              const iPostingDate = fn.convDate(dayjs, curr.CBT_POSTING_DATE);
              if (
                !acc.productionDate ||
                (iPostingDate && iPostingDate < acc.productionDate)
              ) {
                acc.productionDate = iPostingDate;
                acc.productionSiteID = curr.CSITE_UUID;
                acc.productionSiteText + curr.TSITE_UUID;
              }
              acc.productionQuantity =
                Math.round(
                  (acc.productionQuantity +
                    (Number(parseFloat(curr.KCCONFIRMED_QUANTITY).toFixed(5)) ||
                      0)) *
                    1000
                ) / 1000;
              return acc;
            },
            {
              productionDate: "",
              productionSiteID: "",
              productionSiteText: "",
              productionQuantity: 0,
            }
          );
          return { ...item, ...productionItem };
        }
      });

      const filteringItem = fn.uniqWith(shippingDateList);

      draft.response.body = {
        ...draft.response.body,
        cgmp: filteringItem.map((item) => {
          const iStockID = item.identifiedStockID.split("/")[1];
          return { ...item, identifiedStockID: iStockID || "" };
        }),
        E_STATUS: "S",
        E_MESSAGE: "조회가 완료되었습니다",
      };
      break;
    }
    case "productionDate": {
      // 참조 문서 유형이 출하(73)인 경우 출하 항목
      // 출하 항목 중 '고객 출고', '재고 출고(1)'에 해당하는 항목만 필터
      const productionRequestItems = draft.json.productionRequestItems;
      let productionDateList = [];
      const outgoingItems = getDetailCFJ
        .filter((cfj) => cfj.CMOVE_DIRECTION === "1")
        .map((outgoingItem) => {
          const productionOrder = productionRequestItems.find(
            (prdItem) => prdItem.identifiedStockID === outgoingItem.CISTOCK_UUID
          );
          const deliveryQuantity = Number(
            parseFloat(outgoingItem.KCCONFIRMED_QUANTITY).toFixed(5)
          );
          return {
            ...productionOrder,
            deliveryDate: (() => {
              // 전기일 => 출고일
              if (!outgoingItem.CBT_POSTING_DATE) return "";
              const date = fn.convDate(dayjs, outgoingItem.CBT_POSTING_DATE);
              // 출고일 = 실제 출고일 + Working day 5
              return fn.addWeekdays(dayjs, date, 5);
            })(),
            deliveryQuantity, // 수량 => 출고량
            deliveryQuantityUnit: outgoingItem.UCINV_QUAN_NORMAL
              ? fn.unitCodeToKor(outgoingItem.UCINV_QUAN_NORMAL).text
              : "", // 수량 단위 => 출고량 단위
          };
        })
        .filter(Boolean);

      productionDateList = productionDateList.concat(outgoingItems);

      const filteringItem = fn.uniqWith(productionDateList);

      draft.response.body = {
        cgmp_length: filteringItem.length,
        ...draft.response.body,
        productionRequestItems,
        // cgmp: filteringItem,
        cgmp: filteringItem.map((item) => {
          const iStockID = item.identifiedStockID.split("/")[1];
          return { ...item, identifiedStockID: iStockID || "" };
        }),
        getDetailCFJ,
        E_STATUS: "S",
        E_MESSAGE: "조회가 완료되었습니다",
      };
      break;
    }
    default:
      break;
  }

  draft.response.body = {
    getDetailCFJ_leng: getDetailCFJ.length,
    getDetailCFJ,
    ...draft.response.body,
  };
};
