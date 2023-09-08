module.exports = async (draft, { request, odata }) => {
  const { url, username, password } = draft.json;

  const {
    confirmIndicatior,
    deliveryStatus,
    materialID,
    orderDateFrom,
    orderDateTo,
    purchaseOrderID,
    startDateFrom,
    startDateTo,
    supplierID,
    shipToLocationID,
  } = request.body;

  const expand = ["PO", "PO/SellerParty"].join(",");

  const filter = [];

  if (confirmIndicatior) {
    filter.push(`PO/SRM001_KUT eq '${confirmIndicatior}'`);
  }
  if (deliveryStatus) {
    if (deliveryStatus === "3") {
      filter.push(`PurchaseOrderDeliveryStatusCode eq '${deliveryStatus}'`);
    } else {
      filter.push(`PurchaseOrderDeliveryStatusCode le '${deliveryStatus}'`);
    }
  }
  if (materialID) {
    filter.push(`ProductID eq '${materialID}'`);
  }
  if (orderDateFrom && orderDateTo) {
    filter.push(
      [
        `PO/CreationDate ge datetimeoffset'${orderDateFrom}T00:00:00Z'`,
        `PO/CreationDate le datetimeoffset'${orderDateTo}T23:59:59Z'`,
      ].join(" and ")
    );
  }
  if (purchaseOrderID) {
    filter.push(`PO/ID eq '${purchaseOrderID}'`);
  }
  if (startDateFrom && startDateTo) {
    filter.push(
      [
        `StartDateTime ge datetimeoffset'${startDateFrom}T00:00:00Z'`,
        `StartDateTime le datetimeoffset'${startDateTo}T23:59:59Z'`,
      ].join(" and ")
    );
  }
  if (supplierID) {
    filter.push(`PO/SellerPartyID eq '${supplierID}'`);
  }
  if (shipToLocationID) {
    filter.push(`ShipToLocationID eq '${shipToLocationID}'`);
  }

  const queryParameters = [
    `$expand=${expand}`,
    `$filter=(${filter.join(") and (")})`,
    "$top=200",
    "$inlinecount=allpages",
    "$format=json",
  ];

  const odataService = [url, "bsg_purchaseorder/ItemCollection"].join("/");
  const queryString = queryParameters.join("&");
  const odataURL = [odataService, queryString].join("?");

  const queryResult = await odata.get({
    url: odataURL,
    username,
    password,
  });

  const purchaseOrderItemResults = queryResult.d.results;

  let isFirstOccurrence;
  //중복 item 제거
  const filterItem = purchaseOrderItemResults.map((item, idx, arr) => {
    isFirstOccurrence =
      arr.findIndex((v) => v.ProductID === item.ProductID) === idx;
    if (isFirstOccurrence) {
      return item;
    } else {
      return { ProductID: null, PO: { ID: null } };
    }
  });

  const conversion = await Promise.all(
    purchaseOrderItemResults.map(async (item, idx) => {
      const {
        delivery: scheduledQuantity,
        cancel: returnQuantity,
        idnResults: idnResults,
      } = await getQuantity(
        filterItem[idx],
        filterItem[idx].ProductID,
        filterItem[idx].PO.ID,
        idx + 1
      );

      return {
        ThirdPartyDealIndicator: item.ThirdPartyDealIndicator,
        confirmIndicatior: item.PO.SRM001_KUT,
        deliveryStatusText: item.PurchaseOrderDeliveryStatusCodeText,
        index: idx + 1,
        materialID: item.ProductID,
        poItemNumber: item.ID,
        purchaseOrderID: item.PO.ID,
        shipToLocation: item.ShipToLocationID,
        startDate: convDate(item.StartDateTime),
        supplierText: item.PO.SellerParty.FormattedName,
        unitPrice: item.ListUnitPriceAmount, //item.Amount,
        supplierAmount: item.NetAmount,
        unitText: item.BaseQuantityUnitCode,
        currency: item.currencyCode,
        materialText: item.Description,
        orderQuantity: item.Quantity, //발주수량
        deliveredQuantity: item.TotalDeliveredQuantity, //입고수량
        idnQuantity: scheduledQuantity, //납품예정수량
        restQuantity:
          //item.Quantity - item.TotalDeliveredQuantity - scheduledQuantity,
          item.Quantity - item.TotalDeliveredQuantity - scheduledQuantity,
        returnQuantity: returnQuantity, //반품수량
        //itemDesc:  //비고
        idnResults,
      };
    })
  );

  draft.response.body = {
    odataURL,
    purchaseOrderItems: conversion, //purchaseOrderItems
    purchaseOrderItemResults,
    //purchaseOrderItems: [{}],
    // __count,
  };

  function convDate(startDate) {
    const numberString = startDate.replace(/^\/Date\(/, "").replace(")/", "");
    const date = new Date(parseInt(numberString, 10));
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 06
    const day = date.getDate().toString().padStart(2, "0");
    const dateString = year + "-" + month + "-" + day;
    return dateString;
  }

  async function getQuantity(itemData, productID, purchaseID, index) {
    let service, query;

    if (!itemData.DirectMaterialIndicator) {
      service = [url, "bsg_gsa/PurchaseOrderItemReferenceCollection"].join("/");
      query =
        `&$expand=Item` +
        `&$filter=(Item/ProductID eq '${productID}')` +
        `and (ID eq '${purchaseID}')` +
        `and (ItemID eq '${index}')` +
        `&$format=json`;
    } else {
      service = [url, "bsg_inbound_notify/ItemDocPOCollection"].join("/");
      query =
        `&$expand=Item,Item/DeliveryQuantity,InboundDelivery` +
        `&$filter=(Item/ProductID eq '${productID}')` +
        `and (ID eq '${purchaseID}')` +
        `&$format=json`;
    }

    const idnOdataURL = [service, query].join("?");

    const idnResult = await odata.get({
      url: idnOdataURL,
      username,
      password,
    });
    const idnResults = idnResult.d.results;

    let quantityResult;

    if (!itemData.DirectMaterialIndicator) {
      //비재고
      quantityResult = idnResults.reduce(
        (acc, curr) => {
          const quantity = curr.Item.Quantity || 0;
          if (curr.GSA.ReleaseStatusCode === "1") {
            acc.delivery += Number(quantity);
          }
          if (curr.GSA.CancellationStatusCode !== "1") {
            acc.cancel += Number(quantity);
          }
          return acc;
        },
        { delivery: 0, cancel: 0 }
      );
    } else {
      //재고
      quantityResult = idnResults.reduce(
        (acc, curr) => {
          const idnObj = curr.InboundDelivery;
          const cCode = idnObj.CancellationStatusCode;
          const dPCode = idnObj.DeliveryProcessingStatusCode;
          const qtyObj = curr.Item.DeliveryQuantity;
          if (cCode === "1") {
            //Not Canceled
            if (dPCode === "1") {
              //Not started
              acc.delivery += Number(qtyObj.Quantity);
            }
          } else {
            acc.cancel += Number(qtyObj.Quantity);
          }
          return acc;
        },
        { delivery: 0, cancel: 0 }
      );
    }
    return {
      delivery: quantityResult.delivery,
      cancel: quantityResult.cancel,
      idnResults: idnResults,
    };
  }
  //   return idnResults;
  // }
};
