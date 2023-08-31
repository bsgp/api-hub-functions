module.exports = async (draft, { sql }) => {
  const mysql = sql("mysql");

  draft.response.body = await mysql
    .update("CMS_CORP_CARD_APRV_01", {
      INVOICE_NO: null,
      INVOICE_DATE: null,
      ACCOUNT_CD: null,
      ACCOUNT_NAME: null,
      TAX_CD: null,
      TAX_NAME: null,
      ACCOUNT_DESIGNATION_TYPE_CD: null,
      COST_CENTRE_NO: null,
      COST_CENTRE_NAME: null,
      PROJECT_NO: null,
      PROJECT_NAME: null,
      SALES_ORDER_NO: null,
      SALES_ORDER_NAME: null,
      SALES_ORDER_ITEM_NO: null,
      SALES_ORDER_ITEM_NAME: null,
      NON_DEDUCTION_REASON_CD: null,
      SUMMARY: null,
    })
    .whereNot({
      INVOICE_NO: null,
      INVOICE_DATE: null,
    })
    .orWhereNot({
      ACCOUNT_CD: null,
      TAX_CD: null,
    })
    .run();
};
