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
    shipToLocation,
  } = request.body;

  const expand = ["PO", "PO/SellerParty"];

  const filter = [];

  if (confirmIndicatior) {
    filter.push(`PO/SRM001_KUT eq '${confirmIndicatior}'`);
  }
  if (deliveryStatus) {
    //if (deliveryStatus === "3") {
    filter.push(`PurchaseOrderDeliveryStatusCode eq '${deliveryStatus}'`);
    //} else {
    //  filter.push(`DeliveryProcessingStatusCode  '${deliveryStatus}'`);
    //}
  }
  if (materialID) {
    filter.push(`ProductID eq '${materialID}'`);
  }
  if (orderDateFrom && orderDateTo) {
    filter.push(
      [
        `PO/OrderedDateTime ge datetimeoffset'${orderDateFrom}T00:00:00Z'`,
        `PO/OrderedDateTime le datetimeoffset'${orderDateTo}T23:59:59Z'`,
      ].join(" and ")
    );
  }
  if (purchaseOrderID) {
    filter.push(`PO/ID eq '${purchaseOrderID}'`);
  }
  if (startDateFrom && startDateTo) {
    filter.push(
      [
        `PO/CreationDate ge datetimeoffset'${startDateFrom}T00:00:00Z'`,
        `PO/CreationDate le datetimeoffset'${startDateTo}T23:59:59Z'`,
      ].join(" and ")
    );
  }
  if (supplierID) {
    filter.push(`PO/SellerParty/PartyID eq '${supplierID}'`);
  }
  if (shipToLocation) {
    filter.push(`ShipToLocationID eq '${shipToLocation}'`);
  }

  const queryParameters = [
    `$expand=${expand}`,
    `$filter=(${filter.join(") and (")})`,
    //`$filter=${filter.join("&$filter=")}`,
    "$top=200",
    "$inlinecount=allpages",
    "$format=json",
  ];

  const queryString = queryParameters.join("&");

  const odataService = [url, "bsg_purchaseorder/ItemCollection"].join("/");
  const odataURL = [odataService, queryString].join("?");

  const queryResult = await odata.get({
    url: odataURL,
    username,
    password,
  });

  //const __count = Number(queryResult.d.__count);

  const purchaseOrderItemResults = queryResult.d.results;

  const conversion = purchaseOrderItemResults.map((item, idx) => {
    return {
      ThirdPartyDealIndicator: item.ThirdPartyDealIndicator,
      confirmIndicatior: item.PO.SRM001_KUT,
      deliveryStatusText: item.PurchaseOrderDeliveryStatusCodeText,
      index: idx + 1,
      materialID: item.Description,
      orderQuantity: item.Quantity,
      poItemNumber: item.ID,
      purchaseOrderID: item.PO.ID,
      shipToLocation: item.ShipToLocationID,
      startDate: Date(item.StartDateTime),
      supplierText: item.PO.SellerParty.FormattedName,
      unitPrice: item.Amount,
      supplierAmount: item.NetAmount,
      restQuantity: item.Quantity,
      //deliveredQuantity: item.TotalDeliveredQuantity,
      //idnQuantity
      //returnQuantity
      //itemDesc
    };
  });

  draft.response.body = {
    odataURL,
    purchaseOrderItems: conversion,
    purchaseOrderItemResults,
    //purchaseOrderItems: [{}],
    // __count,
  };
};
