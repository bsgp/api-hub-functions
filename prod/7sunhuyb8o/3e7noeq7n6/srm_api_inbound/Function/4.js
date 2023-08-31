module.exports = async (draft, { env, fn, dayjs, odata, user, tryit }) => {
  try {
    const { BYD_URL, BYD_ID, BYD_PASSWORD } = env;
    const params = draft.json.params;

    const queryStringObj = fn.getIDN_Params(params, dayjs);
    // draft.response.body.queryStringObj = queryStringObj;

    const queryString = Object.keys(queryStringObj)
      .map((key) => `${key}=${queryStringObj[key]}`)
      .join("&");

    const service = [
      "/sap/byd/odata/cust/v1",
      "bsg_inbounddeliveryrequest/InboundDeliveryItemCollection?",
    ].join("/");
    const url = [BYD_URL, service, queryString].join("");
    draft.response.body.url = url;

    const idnQueryResults = await fn
      .fetchAll(odata, { url, username: BYD_ID, password: BYD_PASSWORD })
      .then((res) => {
        if (params.isSupplier || params.supplierID) {
          return (res.result || []).filter((idnItem) => {
            return (
              idnItem.ItemSellerParty.PartyID ===
                (params.supplierID || "").toUpperCase() ||
              idnItem.ItemSellerParty.PartyID === (user.id || "").toUpperCase()
            );
          });
        }
        return res.result || [];
      });

    switch (params.searchType) {
      case "header": {
        draft.response.body.conversion = idnQueryResults
          .sort((al, be) => {
            const getStartDate = (response) =>
              tryit(
                () =>
                  response.InboundDelivery.InboundDeliveryArrivalPeriod
                    .StartDateTime,
                ""
              );
            const al_sDate = (getStartDate(al) || "").replace(/[^0-9]+/g, "");
            const be_tDate = (getStartDate(be) || "").replace(/[^0-9]+/g, "");
            return al_sDate - be_tDate;
          })
          .map((idnItem, idx) => {
            const header = idnItem.InboundDelivery;
            const poRef = idnItem.ItemPurchaseOrderReference;
            const deliveryQuantity = idnItem.InboundDeliveryDeliveryQuantity;
            const arrivalPeriod = header.InboundDeliveryArrivalPeriod;
            const shipTo = header.InboundDeliveryShipToLocation;
            const shipToLocation = shipTo.LocationLocation;
            return {
              index: idx + 1,
              idnID: header.ID,
              materialID: idnItem.ProductID,
              materialText: idnItem.FULL_NAME_KUT,
              iStockID: idnItem.IdentifiedStockID,
              productionDate:
                idnItem.ProductionDateTime &&
                fn.convDate(dayjs, idnItem.ProductionDateTime),
              expirationDate:
                idnItem.ExpirationDateTime &&
                fn.convDate(dayjs, idnItem.ExpirationDateTime),
              deliveryQty: deliveryQuantity.Quantity,
              unit: deliveryQuantity.unitCodeText,
              purchaseOrderID: poRef.ID,
              purchaseOrderItemID: poRef.ItemID,
              creationDate: fn.convDate(dayjs, header.CreationDateTime),
              deliveryDate: fn.convDate(dayjs, arrivalPeriod.StartDateTime),
              processingType: header.ProcessingTypeCodeText,
              shipTo: shipTo.LocationID,
              shipToText: shipToLocation.Name,
              supplier: idnItem.ItemSellerParty.PartyID,
              supplierText: idnItem.ItemSellerParty.FormattedName,
              // documentID: gsa(상품및서비스확인)용 cntech 미사용
            };
          });
        if (draft.response.body.conversion.length === 0) {
          draft.response.body.E_MESSAGE = "검색 결과가 없습니다";
        }
        break;
      }
      case "detail": {
        // draft.response.body.idnQueryResults = idnQueryResults;
        if (idnQueryResults.length === 0) {
          draft.response.body = {
            E_STATUS: "F",
            E_MESSAGE: "검색 결과가 없습니다",
          };
          return;
        }
        const purchaseOrderIDs = [];
        const idnList = idnQueryResults.reduce((acc, curr) => {
          const {
            InboundDelivery,
            ItemPurchaseOrderReference,
            ...InboundDeliveryItem
          } = curr;
          const poRef = ItemPurchaseOrderReference;
          const po = poRef.ID;
          if (!purchaseOrderIDs.includes(po)) {
            purchaseOrderIDs.push(po);
          }
          const inboundDeliveryID = InboundDelivery.ID;
          const fIdx = acc.findIndex((idn) => idn.ID === inboundDeliveryID);
          if (fIdx >= 0) {
            acc[fIdx].InboundDeliveryItem.push({
              ...InboundDeliveryItem,
              PoReference: poRef,
            });
          } else {
            const item = { ...InboundDeliveryItem, PoReference: poRef };
            acc.push({ ...InboundDelivery, InboundDeliveryItem: [item] });
          }
          return acc;
        }, []);
        draft.response.body.idnList = idnList;

        /**
         * 구매오더 조회
         */
        // draft.response.body.purchaseOrderIDs = purchaseOrderIDs;
        const po_service = [
          "/sap/byd/odata/cust/v1",
          "bsg_purchaseorder/POCollection?",
        ].join("/");
        const po_chunk = fn.getChunks(purchaseOrderIDs);
        draft.response.body.po_chunk = po_chunk;

        draft.response.body.po_urls = [];
        const poList = [];
        const po_chunk_data = await Promise.all(
          po_chunk.map(async (purchaseOrderID) => {
            const po_queryStringObj = fn.getPurchaseOrderParams({
              purchaseOrderID,
            });
            const po_queryString = Object.keys(po_queryStringObj)
              .map((key) => `${key}=${po_queryStringObj[key]}`)
              .join("&");
            const po_url = [BYD_URL, po_service, po_queryString].join("");
            draft.response.body.po_urls.push(po_url);
            const fetchParams = {
              url: po_url,
              username: BYD_ID,
              password: BYD_PASSWORD,
            };
            const po_response = await fn
              .fetchAll(odata, fetchParams)
              .then((res) => res.result || []);
            poList.push(...po_response.map((po) => ({ ...po })));
            return po_response;
          })
        );
        draft.response.body.po_chunk_data = po_chunk_data;
        draft.response.body.poList = poList;

        /**
         * 발주잔량, 입고수량 등 입하내역 조회
         */
        const idn_report = [
          "/sap/byd/odata/ana_businessanalytics_analytics.svc",
          "RPZ5658043746D8DCE1C4FE7EQueryResults?",
        ].join("/");
        const reportQueryStringObj = fn.getIDN_Report_Params(purchaseOrderIDs);
        const reportQueryString = Object.keys(reportQueryStringObj)
          .map((key) => `${key}=${reportQueryStringObj[key]}`)
          .join("&");
        const report_url = [BYD_URL, idn_report, reportQueryString].join("");

        const queryIDN_Report = await fn
          .fetchAll(odata, {
            url: report_url,
            username: BYD_ID,
            password: BYD_PASSWORD,
          })
          .then(({ result = [] }) => result);
        draft.response.body.queryIDN_Report = queryIDN_Report;

        draft.response.body.conversion = idnList.map((idn) => {
          const arrivalPeriod = idn.InboundDeliveryArrivalPeriod;
          const shipTo = idn.InboundDeliveryShipToLocation;
          const shipToLocation = shipTo.LocationLocation;
          const shipToAddress =
            tryit(
              () =>
                shipToLocation.ShipToLocationAddressSnapshot
                  .ShipToLocationPostalAddress[0],
              {}
            ) || {};
          const note = idn.InboundDeliveryText;
          const supplierNote = note.find((text) => text.TypeCode === "10015");
          // const seller = tryit(
          //   () => idn.InboundDeliveryItem[0].ItemSellerParty,
          //   {}
          // );
          const company = tryit(() => poList[0].BillToParty.PartyID, "") || "";
          const sellerPO = tryit(() => poList[0].SellerParty, {}) || {};
          const seller_address =
            tryit(() => sellerPO.SellerPartyPostalAddress[0], {}) || {};
          const poDesc = tryit(
            () => poList.map((po) => po.PurchaseOrderText[0].Text).join("\n"),
            ""
          );
          return {
            form: {
              idnID: idn.ID,
              releaseStatus: idn.ReleaseStatusCode,
              releaseStatusText: idn.ReleaseStatusCodeText,
              creationDate: fn.convDate(dayjs, idn.CreationDateTime),
              deliveryDate: fn.convDate(dayjs, arrivalPeriod.StartDateTime),
              company,
              shipTo: shipTo.LocationID,
              shipToText: shipToLocation.Name,
              shipToPostalCode: shipToAddress.StreetPostalCode,
              shipToLocation: [
                // shipToAddress.StreetPostalCode,
                `${shipToAddress.RegionCodeText} ${shipToAddress.CityName}`,
                shipToAddress.StreetName,
              ].join("\n"),
              supplier: sellerPO.PartyID,
              supplierText: sellerPO.FormattedName,
              supplierAddress: [
                // seller_address.StreetPostalCode,
                `${seller_address.RegionCodeText} ${seller_address.CityName}`,
                seller_address.StreetName,
              ].join("\n"),
              contactPartyID: sellerPO.ContactPartyID,
              contactText: idn.Driver_KUT,
              contactPhone:
                idn.DriverTelNo_KUT ||
                sellerPO.PhoneNumber ||
                sellerPO.MobilePhoneNumber,
              desc: (supplierNote || {}).Text,
              poDesc,
              po: purchaseOrderIDs,
            },
            list: idn.InboundDeliveryItem.map((item) => {
              const deliveryQuantity = item.InboundDeliveryDeliveryQuantity;
              const po = item.PoReference;
              const poData = poList.find((PO) => PO.ID === po.ID);
              const poItemData =
                (poData &&
                  poData.Item.find((poItem) => poItem.ID === po.ItemID)) ||
                {};
              const poItemDesc = tryit(
                () =>
                  poItemData.PurchaseOrderItemText.find(
                    (text) => text.TypeCode === "10014"
                  ),
                {}
              );
              const fIDN_Item = queryIDN_Report.find(
                (idn) =>
                  idn.CPO_UUID === po.ID && idn.CPO_ITM_UUID === poItemData.ID
              );
              const orderQuantity = poItemData.Quantity;
              const deliveredQuantity = poItemData.TotalDeliveredQuantity;
              let returnQuantity = 0;
              let scheduledQuantity = 0;
              if (fIDN_Item) {
                const cancelStatus = Number(fIDN_Item.CDEL_CANCELLATION_STATUS);
                const releaseStatus = Number(fIDN_Item.CDEL_NOTIF_STAT);
                const idnStatus = Number(fIDN_Item.CDEL_RELEASE_STATUS);
                if (
                  cancelStatus === 1 &&
                  releaseStatus === 3 &&
                  idnStatus === 2
                ) {
                  // 반품수량
                  const returnQty = -(
                    Number(deliveredQuantity) - Number(fIDN_Item.KCDEL_QTY)
                  );
                  returnQuantity = Math.round(returnQty * 1000) / 1000;
                }
                if (
                  cancelStatus === 1 &&
                  releaseStatus === 1 &&
                  idnStatus === 1
                ) {
                  // 납품통지 수량
                  scheduledQuantity = Number(fIDN_Item.KCDEL_QTY);
                }
              }
              const restQuantity =
                Math.round(
                  (Number(orderQuantity) -
                    Number(scheduledQuantity) -
                    Number(deliveredQuantity) +
                    Number(returnQuantity)) *
                    1000
                ) / 1000;

              return {
                index: item.ID,
                objectID: item.ObjectID,
                purchaseOrderID: po.ID,
                purchaseOrderItemID: po.ItemID,
                purchaseOrderText: poItemDesc && poItemDesc.Text,
                materialID: item.ProductID,
                materialText: item.FULL_NAME_KUT || poItemData.Description,
                chargeDivision:
                  (poItemData.ChargeDivision_KUT === "103" &&
                    poItemData.ChargeDivision_KUT) ||
                  "",
                manufacturer: poItemData.Manufacturer_KUT,
                itemproductStandard: poItemData.ProductStandard_KUT,
                processType: "재고 조달",
                orderQuantity,
                restQuantity,
                scheduledQuantity,
                deliveredQuantity,
                deliveryQtyUUID: deliveryQuantity.ObjectID,
                deliveryQty: Number(deliveryQuantity.Quantity),
                unit: deliveryQuantity.unitCodeText,
                unitCode: deliveryQuantity.unitCode,
                useIstock: true,
                iStockID: item.IdentifiedStockID,
                iStockParty: (item.ItemSellerParty || {}).PartyID,
                iStockPartyText: (item.ItemSellerParty || {}).FormattedName,
                externalIStockID: item.IdentifiedStockPartyID,
                productionDate:
                  item.ProductionDateTime &&
                  fn.convDate(dayjs, item.ProductionDateTime),
                expirationDate:
                  item.ExpirationDateTime &&
                  fn.convDate(dayjs, item.ExpirationDateTime),
                deliveryClose: item.DELIVERY_CLOSE_KUT,
                currency: poItemData.currencyCodeText,
                unitPrice: poItemData.ListUnitPriceAmount,
                supplyAmount:
                  Number(poItemData.ListUnitPriceAmount) *
                  Number(deliveryQuantity.Quantity),
                taxAmount:
                  (Number(poItemData.TaxAmount) / Number(poItemData.Quantity)) *
                  Number(deliveryQuantity.Quantity),
                totalAmount:
                  Number(poItemData.NetAmount) + Number(poItemData.TaxAmount),
              };
            }),
          };
        });
        break;
      }
      default: {
        draft.response.body = {
          E_STATUS: "F",
          E_MESSAGE: "searchType이 올바르지 않습니다다",
        };
        break;
      }
    }
  } catch (error) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: ["Error Occurred", error.message].join(": "),
    };
  }
};
