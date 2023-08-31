module.exports = async (draft, { odata, env }) => {
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  const username = draft.json.username;
  const password = draft.json.password;
  const { params, odataService } = draft.json;

  const {
    searchType,
    idnID,
    supplierID,
    creationDateFrom,
    creationDateTo,
    purchaseOrderID,
    materialID,
    iStockID,
    skip,
  } = params;

  const defaultExpand =
    searchType === "header"
      ? [
          "InboundDelivery/VendorParty/VendorAddress",
          "InboundDelivery/ShipTo/ShipToAddress",
          "InboundDelivery/ArrivalPeriod",
          "IDNText",
          "Item/Material",
          "Item/DeliveryQuantity",
          "Item/ItemDocPO",
        ]
      : [
          "InboundDelivery/VendorParty/VendorAddress",
          "InboundDelivery/ShipTo/ShipToAddress",
          "InboundDelivery/ArrivalPeriod",
          "Item/Material",
          "Item/IStock/IStockPartyAddress",
          "Item/DeliveryQuantity",
          "Item/ItemDocPO",
        ];

  if (searchType === "detail" && !idnID) {
    draft.response.E_STATUS = "F";
    draft.response.body.E_MESSAGE = "Invalid request: No inboundNotificationID";
    draft.json.idnResult = [];
    return;
  }

  const queryParameters = ["$inlinecount=allpages", "$format=json"];
  const filter = [];
  let expand, odataCollection;
  if (searchType === "header" || searchType === "detail") {
    odataCollection = "/InboundDeliveryCollection";
    if (searchType === "detail") {
      defaultExpand.push("RecipientParty,IDNText");
    }
    expand = defaultExpand.join(",").replace(/InboundDelivery\//g, "");
    queryParameters.push(`$orderby=CreationDateTime desc`);
    if (idnID) {
      filter.push(`ID eq '${idnID}'`);
    }
    if (creationDateFrom && creationDateTo) {
      filter.push(
        [
          `CreationDateTime ge datetimeoffset'${creationDateFrom}T00:00:00Z'`,
          `CreationDateTime le datetimeoffset'${creationDateTo}T23:59:59Z'`,
        ].join(" and ")
      );
    }
    if (supplierID) {
      filter.push(`VendorParty/PartyID eq '${supplierID}'`);
    }
  }
  if (searchType === "item") {
    if (!materialID && !iStockID) {
      draft.response.E_STATUS = "F";
      draft.response.body.E_MESSAGE = "Invalid request: No search Field";
      draft.json.idnResult = [];
      return;
    }
    odataCollection = "/ItemCollection";
    queryParameters.push(`$orderby=ObjectID desc`);
    expand = defaultExpand.join(",").replace(/Item\//g, "");
    if (materialID) {
      filter.push(`ProductID eq '${materialID}'`);
    }
    if (iStockID) {
      filter.push(`IdentifiedStockID eq '${iStockID}'`);
    }
  }
  if (searchType === "itemDocPO") {
    odataCollection = "/ItemDocPOCollection";
    queryParameters.push(`$orderby=ObjectID desc`);
    expand = defaultExpand.join(",").replace(/,Item\/ItemDocPO/g, "");
    if (!purchaseOrderID) {
      draft.response.E_STATUS = "F";
      draft.response.body.E_MESSAGE = "Invalid request: No purchaseOrderID";
      draft.json.idnResult = [];
      return;
    }
    filter.push(`ID eq '${purchaseOrderID}' and TypeCode eq '001'`);
  }
  const urlHeader = [odataService, odataCollection].join("");

  queryParameters.push(
    `$expand=${expand}`,
    `$filter=(${filter.join(") and (")})`
  );
  if (skip) {
    queryParameters.push(`$skip=${skip}`);
  }
  const queryString = queryParameters.join("&");

  const odataURL = [urlHeader, queryString].join("?");

  const idnData = await odata.get({ url: odataURL, username, password });

  if (idnData.ResponseError || idnData.Exception) {
    draft.json.isFailed = true;
    draft.response.body = { odataURL, ...idnData };
  } else {
    const __count = Number(idnData.d.__count);
    const idnResult = idnData.d.results;
    draft.json.idnResult = idnResult;
    draft.response.body = {
      odataURL,
      idnResult,
      __count,
      isLast: __count === idnResult.length + (skip || 0),
      skipCount: idnResult.length + (skip || 0),
    };
  }
};
