module.exports = async (draft, { env }) => {
  const params = draft.pipe.json.params;

  // const ORD_FIELD_LIST = [
  //   "IDX",
  //   "ORDER_ID",
  //   "MALL_ID",
  //   "MALL_USER_ID",
  //   "MALL_USER_ID2",
  //   "ORDER_STATUS",
  //   "USER_ID",
  //   "USER_NAME",
  //   "USER_TEL",
  //   "USER_CEL",
  //   "USER_EMAIL",
  //   "RECEIVE_TEL",
  //   "RECEIVE_CEL",
  //   "RECEIVE_EMAIL",
  //   "DELV_MSG",
  //   "RECEIVE_NAME",
  //   "RECEIVE_ZIPCODE",
  //   "RECEIVE_ADDR",
  //   "TOTAL_COST",
  //   "PAY_COST",
  //   "ORDER_DATE",
  //   "PARTNER_ID",
  //   "DPARTNER_ID",
  //   "MALL_PRODUCT_ID",
  //   "PRODUCT_ID",
  //   "SKU_ID",
  //   "P_PRODUCT_NAME",
  //   "P_SKU_VALUE",
  //   "PRODUCT_NAME",
  //   "SALE_COST",
  //   "MALL_WON_COST",
  //   "WON_COST",
  //   "SKU_VALUE",
  //   "SALE_CNT",
  //   "DELIVERY_METHOD_STR",
  //   "DELV_COST",
  //   "COMPAYNY_GOODS_CD",
  //   "SKU_ALIAS",
  //   "BOX_EA",
  //   "JUNG_CHK_YN",
  //   "MALL_ORDER_SEQ",
  //   "MALL_ORDER_ID",
  //   "ETC_FIELD3",
  //   "ORDER_GUBUN",
  //   "P_EA",
  //   "REG_DATE",
  //   "ORDER_ETC_1",
  //   "ORDER_ETC_2",
  //   "ORDER_ETC_3",
  //   "ORDER_ETC_4",
  //   "ORDER_ETC_5",
  //   "ORDER_ETC_6",
  //   "ORDER_ETC_7",
  //   "ORDER_ETC_8",
  //   "ORDER_ETC_9",
  //   "ORDER_ETC_10",
  //   "ORDER_ETC_11",
  //   "ORDER_ETC_12",
  //   "ORDER_ETC_13",
  //   "ORDER_ETC_14",
  //   "ord_field2",
  //   "copy_idx",
  //   "GOODS_NM_PR",
  //   "GOODS_KEYWORD",
  //   "ORD_CONFIRM_DATE",
  //   "RTN_DT",
  //   "CHNG_DT",
  //   "DELIVERY_CONFIRM_DATE",
  //   "CANCEL_DT",
  //   "CLASS_CD1",
  //   "CLASS_CD2",
  //   "CLASS_CD3",
  //   "CLASS_CD4",
  //   "BRAND_NM",
  //   "DELIVERY_ID",
  //   "INVOICE_NO",
  //   "HOPE_DELV_DATE",
  //   "FLD_DSP",
  //   "INV_SEND_MSG",
  //   "MODEL_NO",
  //   "SET_GUBUN",
  //   "ETC_MSG",
  //   "DELV_MSG1",
  //   "MUL_DELV_MSG",
  //   "BARCODE",
  //   "INV_SEND_DM",
  //   "DELIVERY_METHOD_STR2",
  //   "FREE_GIFT",
  // ].join("|");
  // const ORD_FIELD = ["<![CDATA[", ORD_FIELD_LIST, "]]>"].join("");

  const xmlObj = {
    SABANG_ORDER_LIST: {
      HEADER: {
        SEND_COMPAYNY_ID: env.SABANGNET_ID,
        SEND_AUTH_KEY: env.SABANGNET_AUTH_KEY,
        SEND_DATE: params.SEND_DATE,
      },
      DATA: {
        ORD_ST_DATE: params.ORD_ST_DATE,
        ORD_ED_DATE: params.ORD_ED_DATE,
        // ORD_FIELD,
        ORD_FIELD: params.ORD_FIELD,
        ORDER_STATUS: params.ORDER_STATUS,
        LANG: params.LANG,
      },
    },
  };
  draft.pipe.json.xmlObj = xmlObj;
  draft.response.body = { ...draft.response.body, xmlObj, E_STATUS: "S" };
};
