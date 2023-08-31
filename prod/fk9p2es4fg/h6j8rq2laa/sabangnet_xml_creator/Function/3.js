module.exports = async (draft, { request, lib }) => {
  const { defined } = lib;
  const requestTime = request.requestTime;
  draft.pipe.json.requestTime = requestTime;
  const SEND_DATE = [requestTime[0], requestTime[1], requestTime[2]].join("");

  const params = defined(draft.pipe.json.xmlParams, {});
  const body = defined(request.body, {});

  const FIELD = params.ORD_FIELD ||
    body.ORD_FIELD || [
      "IDX",
      "ORDER_ID",
      "MALL_ID",
      "ORDER_STATUS",
      "USER_ID",
      "DELV_MSG",
      "RECEIVE_TEL",
      "RECEIVE_CEL",
      "RECEIVE_NAME",
      "RECEIVE_ZIPCODE",
      "RECEIVE_ADDR",
      "MALL_PRODUCT_ID",
      "PRODUCT_ID",
      "P_PRODUCT_NAME",
      "P_SKU_VALUE",
      "SALE_COST",
      "P_EA",
    ];
  const ORD_FIELD = ["<![CDATA[", FIELD.join("|"), "]]>"].join("");

  draft.pipe.json.params = {
    SEND_DATE,
    ORD_ST_DATE: params.ORD_ST_DATE || body.ORD_ST_DATE,
    ORD_ED_DATE: params.ORD_ED_DATE || body.ORD_ED_DATE,
    FIELD,
    ORD_FIELD,
    ORDER_STATUS: params.ORDER_STATUS || body.ORDER_STATUS || "004",
    LANG: "UTF-8",
  };

  draft.response.body = { xmlRequestParams: draft.pipe.json.params };
};
