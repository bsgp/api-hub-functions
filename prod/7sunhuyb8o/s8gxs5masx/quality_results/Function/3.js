module.exports = async (draft, { request, env, fn, odata, tryit, dayjs }) => {
  const { resultUploadKey, ...args } = request.body || {};
  draft.json.params = { ...args };
  const { form, filter } = draft.json.params;
  draft.json.qr_resultUploadKey = resultUploadKey;
  draft.response.body = {};

  const cfProps = getODataProps({ type: "cf", filter, env });
  try {
    const queryResult = await fn
      .fetchAll(odata, cfProps)
      .then((res) => res.result || []);

    const cfList = fn
      .convOut(queryResult, dayjs)
      .reduce((acc, curr) => {
        const matchedIndex = acc.findIndex(
          (acc) =>
            acc.documentID === curr.documentID &&
            acc.materialID === curr.materialID &&
            acc.iStockID === curr.iStockID
        );
        if (matchedIndex < 0) {
          curr.accumulatedIDs = [curr.confID];
          curr.finishedDate = curr.postingDate;
          curr.quantity = fn.Quantity.create(
            curr.quantity.number,
            curr.quantity.unit.id
          );
          acc.push(curr);
        } else {
          const matchedItem = acc[matchedIndex];
          matchedItem.accumulatedIDs.push(curr.confID);
        }
        return acc;
      }, [])
      .filter((result) => {
        // if (!result.documentID) { console.warn("removed:", result); }
        return !!result.documentID;
      })
      .map((result) => ({ ...result, tested: false }));

    if (!cfList || cfList.length === 0) {
      draft.response.body = {
        request,
        E_STATUS: "F",
        E_MESSAGE: "조건에 맞는 결과가 없습니다",
        url: cfProps.url,
      };
      return;
    }

    const chunk_iStockIDs = fn.getChunks(
      cfList.map(({ iStockID }) => iStockID)
    );

    const iStockList = await Promise.all(
      chunk_iStockIDs.map(async (list) => {
        const filter = [
          list.map((iStockID) => `ID eq '${iStockID}'`).join(" or "),
        ];
        const iStockProps = getODataProps({ type: "iStock", filter, env });
        return await fn
          .fetchAll(odata, iStockProps)
          .then((res) => res.result || []);
      })
    ).then((res) =>
      res.flat().map((item) => ({
        id: item.ID,
        objectID: item.ObjectID,
        text: item.Description,
        externalID: item.IdentifiedStockPartyID,
        extension: { qcReport: item.QC_REPORT_KUT },
      }))
    );

    let qrList = cfList
      .map((item) => {
        const iStock = iStockList.find((iStock) => iStock.id === item.iStockID);
        if (iStock !== undefined) {
          const test = tryit(() => JSON.parse(iStock.extension.qcReport));
          item.iStockExternalID = iStock.externalID;
          item.iStockText = iStock.text;
          item.test = test;
          item.tested = !!tryit(() => test.testDate);
        }
        if (item.test) {
          item.testResult = item.test.testResult;
        } else item.testResult = "";
        return item;
      })
      .filter(({ tested }) =>
        [form.isTested, !form.notTested].includes(tested)
      );

    // const documentIDs = qrList.map(({ documentID }) => documentID);
    const chunk_documentIDs = fn.getChunks(
      qrList.map(({ documentID }) => documentID)
    );

    switch (form.documentType) {
      case "purchasing": {
        const purchaseOrder = await Promise.all(
          chunk_documentIDs.map(async (list) => {
            const filter = [
              list.map((docID) => `ID eq '${docID}'`).join(" or "),
            ];
            const pcoProps = getODataProps({ type: "purchasing", filter, env });
            return await fn
              .fetchAll(odata, pcoProps)
              .then((res) => res.result || []);
          })
        ).then((res) => res.flat());

        // draft.response.body.purchaseOrder = purchaseOrder;

        qrList = qrList.map((item) => {
          const order = purchaseOrder.find(({ ID }) => ID === item.documentID);
          const orderItem = tryit(
            () => order.Item.map((each) => each),
            []
          ).find((each) => each.ProductID === item.materialID);
          if (order) {
            item.supplierID = order.SellerParty.PartyID;
            item.supplierText = order.SellerParty.FormattedName;
            item.orderStatus = order.PurchaseOrderLifeCycleStatusCode;
            item.orderStatusText = order.PurchaseOrderLifeCycleStatusCodeText;
            item.orderQuantity = orderItem.Quantity;
          }
          return item;
        });
        break;
      }
      case "production": {
        const productionOrders = await Promise.all(
          chunk_documentIDs.map(async (list) => {
            const filter = [
              list.map((docID) => `ID eq '${docID}'`).join(" or "),
            ];
            const pdoProps = getODataProps({ type: "production", filter, env });
            return await fn
              .fetchAll(odata, pdoProps)
              .then((res) => res.result || []);
          })
        ).then((res) =>
          res.flat().map((pdo) => {
            const lot = pdo.ProductionLot || {};
            const lotInputs = tryit(() => lot.ProductionLotMaterialInput) || [];
            const lotOutputs =
              tryit(() => lot.ProductionLotMaterialOutput) || [];
            return {
              id: pdo.ID,
              status: {
                lifeCycle: {
                  id: pdo.LifeCycleStatusCode,
                  text: pdo.LifeCycleStatusCodeText,
                },
              },
              lot: {
                id: lot.ID,
                inputs: lotInputs.map((input) => {
                  const category = tryit(
                    () => input.MaterialCrossProcessCategory || {},
                    {}
                  );
                  return {
                    id: input.InternalID,
                    text: input.Description,
                    category: { id: category.ProductCategoryInternalID },
                    iStock: { id: input.ID },
                  };
                }),
                output: {
                  id: lotOutputs[0].InternalID,
                  text: lotOutputs[0].Description,
                  iStock: { id: lotOutputs[0].ID },
                  plannedQuantity: fn.Quantity.create(
                    lotOutputs[0].PlannedQuantity,
                    lotOutputs[0].PlannedUnitCode
                  ),
                },
              },
            };
          })
        );

        draft.response.body.productionOrders = productionOrders;
        qrList = qrList.map((item) => {
          const order = productionOrders.find(
            ({ id }) => id === item.documentID
          );
          if (order) {
            item.orderStatus = order.status.lifeCycle.id;
            item.orderStatusText = order.status.lifeCycle.text;
            item.orderQuantity = order.lot.output.plannedQuantity;
          }
          return item;
        });
        break;
      }
      case "transition": {
        const transferOrder = await Promise.all(
          chunk_documentIDs.map(async (list) => {
            const filter = [
              list.map((docID) => `ID eq '${docID}'`).join(" or "),
            ];
            const trProps = getODataProps({ type: "transition", filter, env });
            return await fn
              .fetchAll(odata, trProps)
              .then((res) => res.result || []);
          })
        ).then((res) =>
          res.flat().map((order) => {
            const eRequests = tryit(() => order.ExternalRequest) || [];
            const items = (eRequests[0] && eRequests[0].Item) || [];
            return {
              id: order.ID,
              status: {
                processing: {
                  id: eRequests[0].ProcessingStatusCode,
                  text: eRequests[0].ProcessingStatusCodeText,
                },
              },
              items: items.map((item) => ({
                id: item.ID,
                material: {
                  id: item.InternalID,
                  text: item.Description,
                },
                requestedQuantity: fn.Quantity.create(
                  item.CumulatedRequestedQuantity,
                  item.CumulatedRequestedUnitCode
                ),
                shipFromSite: item.ShipFromSite && item.ShipFromSite.LocationID,
                shipToSite: item.ShipToSite && item.ShipToSite.LocationID,
              })),
            };
          })
        );

        // draft.response.body.transferOrder = transferOrder;
        qrList = qrList.map((item) => {
          const order = transferOrder.find(({ id }) => id === item.documentID);
          const orderItem = tryit(
            () => order.items.map((each) => each),
            []
          ).find((each) => each.material.id === item.materialID);
          if (order) {
            item.orderStatus = order.status.processing.id;
            item.orderStatusText = order.status.processing.text;
            item.orderQuantity = orderItem.requestedQuantity;
            item.shipFromSite = orderItem.shipFromSite;
            item.shipToSite = orderItem.shipToSite;
          }
          return item;
        });
        break;
      }
      default:
        break;
    }

    const queryResult2 = await Promise.all(
      chunk_documentIDs.map(async (list) => {
        const filter2 = filter.filter(
          (each) => !/(CBT_POSTING_DATE){1,}/.test(each)
        );
        const cfProps2 = getODataProps({
          env,
          type: "cf",
          filter: [
            ...filter2,
            `(${list.map((docID) => `CREF_ID eq '${docID}'`).join(" or ")})`,
          ],
        });
        return await fn
          .fetchAll(odata, cfProps2)
          .then((res) => res.result || []);
      })
    ).then((res) => res.flat());

    const outList = fn.convOut(queryResult2, dayjs);
    draft.response.body.qualityResults = qrList
      .map((item) => {
        const confList = outList.filter(
          (conf) =>
            conf.documentID === item.documentID &&
            conf.materialID === item.materialID &&
            conf.iStockID === item.iStockID
        );
        console.warn(
          confList.map(({ confID, confItemID }) => `${confID} ${confItemID}`)
        );
        confList.forEach((conf) => {
          item.quantity = fn.Quantity.create(
            fn.Quantity.add(conf.quantity.number, item.quantity.number),
            item.quantity.unit.id
          );
          if (item.postingDate > conf.postingDate) {
            item.postingDate = conf.postingDate;
          }
          if (item.finishedDate < conf.postingDate) {
            item.finishedDate = conf.postingDate;
          }
        });
        return item;
      })
      .map((item) => {
        return {
          ...item,
          unit: item.quantity.unit.external.id,
          quantity: item.quantity.formatted,
          orderQuantity: item.orderQuantity.formatted,
        };
      });

    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "S",
      E_MESSAGE: "조회가 완료되었습니다다",
      url: cfProps.url,
      cfList,
      qrList,
      iStockList,
    };
  } catch (error) {
    draft.response.body = {
      request,
      E_STATUS: "F",
      E_MESSAGE: "에러가 발생했습니다",
      message: error.message,
    };
  }
};

const cf_select = [
  "CMOVE_DIRECTION", // 이동 방향
  "TMOVE_DIRECTION",
  "CBT_POSTING_DATE",
  "CCONF_ID", // 확인 ID
  "CCANC_ID",
  "CITEM_ID",
  "C1N6061KGKRRDY27JVXB8IBB48I", // 무검사
  "C1H4ROBQ2CJYN7HZXJJXDQ9N3TM", // 품질명칭
  "C1PUM32FIIWRGVQAF4BD5HUK4HA", // FULL NAME
  "CSITE_UUID", // 사이트 ID
  "TSITE_UUID", // 사이트 ID
  "CMATERIAL_UUID", // 제품 ID
  "TMATERIAL_UUID", // 제품 ID
  "CISTOCK_UUID", // 동종 재고 ID
  "TISTOCK_UUID", // 동종 재고 ID
  "CCATCP_UUID", // 범주 ID
  "TCATCP_UUID", // 범주 ID
  "CREF_MST_ID", // 원본 문서 ID
  "CREF_ID", // 참조 문서 ID
  "CREF_MST_TYPE", // 원본 문서 유형
  "CREF_TYPE", // 참조 문서 유형
  "KCINV_QUAN_NORMAL", // 유효수량
  "UCINV_QUAN_NORMAL", // 유효수량
];

function getODataProps({ type, filter, env }) {
  const report = "/sap/byd/odata/cc_home_analytics.svc";
  const odata = "/sap/byd/odata/cust/v1";
  let queryStringObj = {
    "sap-language": "ko",
    $format: "json",
    $inlinecount: "allpages",
    $filter: filter.join(" and "),
  };
  let service;
  switch (type) {
    case "cf":
    case "cf_docID": {
      queryStringObj = { ...queryStringObj, $select: cf_select };
      service = [report, "RPSCMCFJU01_Q0001QueryResults?"].join("/");
      break;
    }
    case "iStock": {
      const collection = "bsg_identified_stock/IdentifiedStockCollection?";
      service = [odata, collection].join("/");
      break;
    }
    case "purchasing": {
      queryStringObj = { ...queryStringObj, $expand: "Item,SellerParty" };
      service = [odata, "bsg_purchaseorder/POCollection?"].join("/");
      break;
    }
    case "production": {
      const inputCategory = [
        "ProductionLot",
        "ProductionLotMaterialInput",
        "MaterialCrossProcessCategory",
      ].join("/");
      const materialOutput = "ProductionLot/ProductionLotMaterialOutput";
      queryStringObj = {
        ...queryStringObj,
        $expand: [inputCategory, materialOutput].join(","),
      };

      const collection = "bsg_productionorder/ProductionOrderCollection?";
      service = [odata, collection].join("/");
      break;
    }
    case "transition": {
      const expand = [
        "ExternalRequest/Item/ShipFromSite",
        "ExternalRequest/Item/ShipToSite",
      ].join(",");
      queryStringObj = { ...queryStringObj, $expand: expand };

      const collection =
        "bsg_stocktransferorder/CustomerRequirementCollection?";
      service = [odata, collection].join("/");
      break;
    }
    default:
      break;
  }
  const queryString = Object.keys(queryStringObj)
    .map((key) => `${key}=${queryStringObj[key]}`)
    .join("&");

  const url = [env.BYD_URL, service, queryString].join("");
  return { url, username: env.BYD_ID, password: env.BYD_PASSWORD };
}
