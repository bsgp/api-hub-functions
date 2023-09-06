module.exports = async (draft, { fn, dayjs, odata, user }) => {
  const { params } = draft.json.params;
  const { rootURL, username, password } = draft.json;
  try {
    const queryStringObj = fn.getPO_ItemParams(params, dayjs);
    const queryString = Object.keys(queryStringObj)
      .map((key) => `${key}=${queryStringObj[key]}`)
      .join("&");

    const poItemCollection = "/bsg_purchaseorder/ItemCollection?";
    const odataParams = {
      url: [rootURL, poItemCollection, queryString].join(""),
      username,
      password,
    };

    const queryPO_Item = await fn
      .fetchAll(odata, odataParams)
      .then(({ result = [] }) => result);
    const queryPurchaseOrderItems = queryPO_Item.filter((poItem) => {
      return (
        !params.isSupplier ||
        (params.isSupplier && poItem.PO.SellerPartyID === user.id.toUpperCase())
      );
    });

    const poList = queryPurchaseOrderItems.reduce((acc, curr) => {
      if (!acc.includes(curr.PO.ID)) {
        acc.push(curr.PO.ID);
      }
      return acc;
    }, []);

    /**
     * conversion
     */

    const purchaseOrderItems = queryPurchaseOrderItems.map((item, idx) => {
      return {
        index: idx + 1,
        ThirdPartyDealIndicator: "",
        confirmIndicatior: "",
        deliveryStatusText: "",
        startDate: "",
        shipToLocation: "",
        purchaseOrderID: item.PO.ID,
        poItemNumber: item.ID,
        materialID: item.ProductID,
        materialText: "",
        supplierText: "",
        unitPrice: "",
        currency: "",
        unitText: "",
        supplierAmount: "",
        orderQuantity: "",
        idnQuantity: "",
        restQuantity: "",
        deliveredQuantity: "",
        returnQuantity: "",
        itemDesc: "",
      };
    });

    draft.response.body = {
      params,
      po_url: odataParams.url,
      purchaseOrderItems,
      poList,
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
