module.exports = async (draft, { rfc, file, env }) => {
  const rfcFn = draft.json.rfcFn;
  const params = draft.json.params;

  const fnName = "BAPI_PO_GETDETAIL";
  if (rfcFn !== fnName) {
    return;
  }

  const PURCHASEORDER = `${params.PURCHASEORDER}`;
  let result;
  try {
    const rfcIF = {
      ashost: env.RFC_ASHOST,
      client: env.RFC_CLIENT,
      user: env.RFC_USER,
      passwd: env.RFC_PASSWORD,
      lang: "en",
    };
    const filter = { PURCHASEORDER };
    const opt = { version: "750" };

    const rfcResult = await rfc.invoke(fnName, filter, rfcIF, opt);

    if (rfcResult.statusCode !== 200) {
      // throw new Error("RFC Call statusCode error");
      draft.response.body.origin = rfcResult;
      return;
    }
    draft.response.body.origin = rfcResult;
    const rfcData = rfcResult.body.result;
    const header = rfcData.PO_HEADER || {};
    const address = rfcData.PO_ADDRESS || {};
    const items = rfcData.PO_ITEMS || [];
    let NET_VALUE = 0;
    const po = {
      VENDOR: header.VENDOR,
      VEND_NAME: header.VEND_NAME,
      PO_NUMBER: rfcData.PURCHASEORDER,
      DOC_DATE: header.DOC_DATE,
      PUR_GROUP: header.PUR_GROUP,
      TEL: address.TEL_NUMBER,
      INV_DESC: "",
      EMAIL: "",
      SHIP_TO: "",
      ITEMS: items.map((item) => {
        NET_VALUE += Number(item.NET_VALUE);
        return {
          APROVAL_STATUS: false,
          PO_ITEM: item.PO_ITEM.replace(/^0*/, ""),
          MATERIAL: item.MATERIAL.replace(/^0*/, ""),
          SHORT_TEXT: item.SHORT_TEXT,
          STORE_LOC: item.STORE_LOC,
          QUANTITY: item.QUANTITY,
          UNIT: item.UNIT,
          UNIT_VALUE: Number(item.NET_PRICE),
          NET_VALUE: Number(item.NET_VALUE),
          INV_DESC: "",
        };
      }),
    };
    result = { ...po, NET_VALUE };

    const uploadFileName = `/srm/test/result.js`;
    await file.upload(uploadFileName, result, { gzip: true });
  } catch (error) {
    const uploadFileName = `/srm/test/error.js`;
    await file.upload(uploadFileName, error.message, { gzip: true });
    throw error;
  }

  draft.response.body[fnName] = result;
  draft.response.body.E_STATUS = "S";
};
