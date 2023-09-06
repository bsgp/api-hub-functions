module.exports = async (draft, { fn, dayjs, odata, user }) => {
  const { params, username, password } = draft.json.params;
  try {
    const queryStringObj = fn.getPO_ItemParams(params, dayjs);
    const queryString = Object.keys(queryStringObj)
      .map((key) => `${key}=${queryStringObj[key]}`)
      .join("&");
    const po_url = [
      draft.json.rootURL,
      "/bsg_purchaseorder/ItemCollection?",
      queryString,
    ].join("");

    const queryPO_Item = await fn
      .fetchAll(odata, { url: po_url, username, password })
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
      url: po_url,
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
