module.exports = async (draft, { odata }) => {
  const path = draft.json.reqPath;
  const username = draft.json.username;
  const password = draft.json.password;
  const url = draft.json.url;
  const params = draft.json.params;

  const {
    purchaseOrderID,
    confirmIndicatior,
    deliveryStatus,
    confirmDateFrom,
    confirmDateTo,
    orderDateFrom,
    orderDateTo,
    supplierID,
    skip,
    isSupplier,
  } = params;

  const expand =
    path === "/byd_po_header"
      ? [
          "SellerParty/SellerPartyDisplayName",
          "EmployeeResponsibleParty/EmployeeResponsiblePartyDisplayName",
          "PurchaseOrderText",
          "BillToParty/BillToPartyDisplayName",
        ].join(",")
      : [
          "SellerParty/SellerPartyDisplayName",
          "SellerParty/SellerPartyPostalAddress",
          "EmployeeResponsibleParty/EmployeeResponsiblePartyDisplayName",
          "PurchaseOrderText",
          "Item/PurchaseOrderItemScheduleLine",
          "Item/PurchaseOrderReceivingItemSite",
          // "Item/PurchaseOrderItemAttachmentFolder",
          "Item/ItemShipToAddress/ItemShipToPostalAddress",
          "Item/PurchaseOrderItemText",
          "BillToParty/BillToPartyDisplayName",
          "BillToParty/BillToPartyPostalAddress",
        ];

  if (path !== "/byd_po_header" && !purchaseOrderID) {
    draft.response.body.E_MESSAGE = "Invalid request: No purchaseOrderID";
    draft.json.purchaseOrder = [];
    return;
  }

  const filter = [];

  if (purchaseOrderID) {
    filter.push(`ID eq '${purchaseOrderID}'`);
  }
  if (confirmIndicatior) {
    const ext = "SRM001_KUT";
    filter.push(`${ext} eq ${confirmIndicatior}`);
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
  if (confirmDateFrom && confirmDateTo) {
    // TODO: SET Extension key
    const ext = "SRM002_KUT";
    filter.push(
      [
        `${ext} ge datetime'${confirmDateFrom}T00:00:00'`,
        `${ext} le datetime'${confirmDateTo}T23:59:59'`,
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
    filter.push(`SellerParty/PartyID eq '${supplierID.toUpperCase()}'`);
  }
  if (isSupplier) {
    filter.push(
      [
        "PurchaseOrderLifeCycleStatusCode eq '6'",
        "PurchaseOrderLifeCycleStatusCode eq '7'",
        "PurchaseOrderLifeCycleStatusCode eq '9'",
        // "PurchaseOrderLifeCycleStatusCode eq '10'",
      ].join(" or ")
    );
  }

  const queryParameters = [
    `$expand=${expand}`,
    `$filter=(${filter.join(") and (")})`,
    `$orderby=ID DESC`,
    "$inlinecount=allpages",
    "$format=json",
  ];
  if (skip) {
    queryParameters.push(`$skip=${skip}`);
  }
  const queryString = queryParameters.join("&");

  const odataService = [url, "bsg_purchaseorder/POCollection"].join("/");
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
    if (path !== "/byd_po_header") {
      draft.json.nextNodeKey = "Function#5";
    } else {
      draft.json.nextNodeKey = "Flow#6";
    }
  }
};
