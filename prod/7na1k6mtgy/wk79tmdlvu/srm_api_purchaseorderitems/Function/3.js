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
  const conversion = purchaseOrderItemResults.map((item, idx) => {
    const idnQuantity = getIdnQuantity(item.ProductID, item.PO.ID);
    return {
      ThirdPartyDealIndicator: item.ThirdPartyDealIndicator,
      confirmIndicatior: item.PO.SRM001_KUT,
      deliveryStatusText: item.PurchaseOrderDeliveryStatusCodeText,
      index: idx + 1,
      materialID: item.ProductID, //item.Description,
      poItemNumber: item.ID,
      purchaseOrderID: item.PO.ID,
      shipToLocation: item.ShipToLocationID,
      startDate: convDate(item.StartDateTime), //item.StartDateTime,
      supplierText: item.PO.SellerParty.FormattedName,
      unitPrice: item.ListUnitPriceAmount, //item.Amount,
      supplierAmount: item.NetAmount,
      unitText: item.BaseQuantityUnitCode,
      currency: item.currencyCode,
      materialText: item.Description,
      orderQuantity: item.Quantity, //발주수량
      deliveredQuantity: item, //item.TotalDeliveredQuantity, //입고수량
      idnQuantity, //납품예정수량
      // restQuantity: item.Quantity, //발주잔량
      //returnQuantity: , //반품수량
      //itemDesc:  //비고
    };
  });

  draft.response.body = {
    odataURL,
    purchaseOrderItems: conversion,
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

  async function getIdnQuantity(productID, purchaseID) {
    const service = [url, "bsg_inbound_notify/ItemDocPOCollection"].join("/");
    const query =
      `&$expand=Item,Item/DeliveryQuantity` +
      `&$filter=(Item/ProductID eq '${productID}')` +
      `and (ID eq '${purchaseID}')` +
      `&$format=json`;

    const quantityOdataURL = [service, query].join("?");

    const quantityResult = await odata.get({
      url: quantityOdataURL,
      username,
      password,
    });
    const quantityResults = quantityResult.d.results;
    //const sumQuantity = 0;
    //const quantity = quantityResults.map((item) => {
    //  sumQuantity += item.Item.DeliveryQuantity.Quantity;
    //  return sumQuantity;
    //});
    return quantityResults;
  }
};
