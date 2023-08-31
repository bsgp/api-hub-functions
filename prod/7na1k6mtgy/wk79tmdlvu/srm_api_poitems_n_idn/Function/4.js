module.exports = async (draft, { odata }) => {
  const username = draft.json.username;
  const password = draft.json.password;
  const odataService = draft.json.odataService;
  const params = draft.json.params;

  const {
    purchaseOrderID,
    deliveryStatus,
    confirmIndicatior,
    orderDateFrom,
    orderDateTo,
    shipToLocationID,
    startDateFrom,
    startDateTo,
    supplierID,
    skip,
  } = params;

  const expand = ["PO"].join(",");

  const filter = [];
  if (purchaseOrderID) {
    filter.push(`PO/ID eq '${purchaseOrderID}'`);
  }
  if (confirmIndicatior) {
    const ext = "SRM001_KUT";
    filter.push(`PO/${ext} eq ${confirmIndicatior}`);
  }
  if (deliveryStatus) {
    if (deliveryStatus === "1") {
      filter.push(
        [
          `PurchaseOrderDeliveryStatusCode eq '1'`,
          `PurchaseOrderDeliveryStatusCode eq '2'`,
        ].join(" or ")
      );
    } else {
      filter.push(`PurchaseOrderDeliveryStatusCode eq '${deliveryStatus}'`);
    }
  }
  if (shipToLocationID) {
    filter.push(`ShipToLocationID eq '${shipToLocationID}'`);
  }
  if (startDateFrom && startDateTo) {
    filter.push(
      [
        `StartDateTime ge datetimeoffset'${startDateFrom}T00:00:00Z'`,
        `StartDateTime le datetimeoffset'${startDateTo}T23:59:59Z'`,
      ].join(" and ")
    );
  }
  if (orderDateFrom && orderDateTo) {
    filter.push(
      [
        `CreationDate ge datetimeoffset'${orderDateFrom}T00:00:00Z'`,
        `CreationDate le datetimeoffset'${orderDateTo}T23:59:59Z'`,
      ].join(" and ")
    );
  }
  if (supplierID) {
    filter.push(`SellerParty/PartyID eq '${supplierID}'`);
  }

  const queryParameters = [
    `$expand=${expand}`,
    `$filter=(${filter.join(") and (")})`,
    `$orderby=StartDateTime DESC`,
    "$inlinecount=allpages",
    "$format=json",
  ];
  if (skip) {
    queryParameters.push(`$skip=${skip}`);
  }
  const queryString = queryParameters.join("&");

  const odataURL = [odataService, queryString].join("?");

  const purchaseOrderData = await odata.get({
    url: odataURL,
    username,
    password,
  });
  if (purchaseOrderData.ResponseError || purchaseOrderData.Exception) {
    draft.json.isFailed = true;
    draft.response.body = {
      odataURL,
      ...purchaseOrderData,
    };
  } else {
    const __count = Number(purchaseOrderData.d.__count);
    const purchaseOrder = purchaseOrderData.d.results;
    draft.json.purchaseOrder = purchaseOrder;
    draft.response.body = {
      odataURL,
      purchaseOrder,
      __count,
      isLast: __count === purchaseOrder.length + (skip || 0),
    };
  }
};
