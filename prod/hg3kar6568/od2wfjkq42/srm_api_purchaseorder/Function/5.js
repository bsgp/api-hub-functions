module.exports = async (draft, { odata }) => {
  const purchaseOrder = draft.json.purchaseOrder;
  const username = draft.json.username;
  const password = draft.json.password;
  const url = draft.json.url;

  const idnURL = getIDN_URL({ url, purchaseOrder });
  const idnData = await odata.get({ url: idnURL, username, password });

  if (idnData.ResponseError || idnData.Exception) {
    draft.response.body = {
      ...draft.response.body,
      idn: { idnData, idnURL },
    };
  } else {
    const __count = Number(idnData.d.__count);
    const result = idnData.d.results;
    draft.json.idn = result;
    draft.response.body = {
      ...draft.response.body,
      idn: { idnURL, result, __count, isLast: __count === result.length },
    };
  }

  const gsaURL = getGSA_URL({ url, purchaseOrder });
  const gsaData = await odata.get({ url: gsaURL, username, password });

  if (gsaData.ResponseError || gsaData.Exception) {
    draft.response.body = {
      ...draft.response.body,
      gsa: { gsaData, idnURL },
    };
  } else {
    const __count = Number(gsaData.d.__count);
    const result = gsaData.d.results;
    draft.json.gsa = result;
    draft.response.body = {
      ...draft.response.body,
      gsa: {
        gsaURL,
        result,
        __count,
        isLast: __count === result.length,
      },
    };
  }

  function getIDN_URL({ url, purchaseOrder }) {
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
    return `${url}/${endpoint}?${queryString}`;
  }

  function getGSA_URL({ url, purchaseOrder }) {
    const expand = [
      "GSA/Reference",
      "Item/Location/LocationAddress/FormattedAddress",
    ].join(",");
    const poStr = purchaseOrder.map((po) => `ID eq '${po.ID}'`).join(" or ");
    const filter = `(${poStr}) and TypeCode eq '001'`;

    const queryParameters = [
      `$expand=${expand}`,
      `$filter=${filter}`,
      "$inlinecount=allpages",
      "$format=json",
    ];
    const endpoint = "bsg_gsa/PurchaseOrderItemReferenceCollection";
    const queryString = queryParameters.join("&");
    return `${url}/${endpoint}?${queryString}`;
  }
};
