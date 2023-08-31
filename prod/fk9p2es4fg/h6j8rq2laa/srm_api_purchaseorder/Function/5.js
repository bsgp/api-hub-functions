module.exports = async (draft, { odata }) => {
  const purchaseOrder = draft.json.purchaseOrder;
  const username = draft.json.username;
  const password = draft.json.password;
  const url = draft.json.url;

  const expand = ["InboundDelivery", "Item/DeliveryQuantity"].join(",");
  const poStr = purchaseOrder.map((po) => `ID eq '${po.ID}'`).join(" or ");
  const filter = `(${poStr}) and TypeCode eq '001'`;

  const queryParameters = [
    `$expand=${expand}`,
    `$filter=${filter}`,
    "$inlinecount=allpages",
    "$format=json",
  ];
  const endpoint = "bsg_inbound_notify/ItemDocPOCollection";
  const queryString = queryParameters.join("&");
  const odataURL = `${url}/${endpoint}?${queryString}`;

  const idnData = await odata.get({ url: odataURL, username, password });

  if (idnData.ResponseError || idnData.Exception) {
    draft.response.body = {
      ...draft.response.body,
      idn: { idnData, odataURL },
    };
  } else {
    const __count = Number(idnData.d.__count);
    const result = idnData.d.results;
    draft.json.idn = result;
    draft.response.body = {
      ...draft.response.body,
      idn: { odataURL, result, __count, isLast: __count === result.length },
    };
  }
};
