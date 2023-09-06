module.exports = async (draft, { fn, dayjs, odata, user }) => {
  const { params } = draft.json.params;
  const { rootURL, username, password } = draft.json;
  try {
    const queryStringObj = fn.getPO_ItemParams(params, dayjs);
    const queryString = Object.keys(queryStringObj)
      .map((key) => `${key}=${queryStringObj[key]}`)
      .join("&");

    const collection = "/bsg_purchaseorder/ItemCollection?";
    const odataParams = {
      url: [rootURL, collection, queryString].join(""),
      username,
      password,
    };

    const queryPO_Item = await fn
      .fetchAll(odata, odataParams)
      .then(({ result = [] }) => result);
    const queryPurchaseOrderItems = queryPO_Item.filter((po) => {
      const userID = `${user.id}`;
      return (
        !params.isSupplier ||
        (params.isSupplier && po.PO.SellerPartyID === userID.toUpperCase())
      );
    });
    draft.response.body = {
      ...draft.response.body,
      params,
      po_url: odataParams.url,
      queryPurchaseOrderItems,
    };
  } catch (error) {
    draft.response.body = {
      ...draft.response.body,
      params,
      E_STATUS: "F",
      E_MESSAGE: error.message,
    };
  }
};
