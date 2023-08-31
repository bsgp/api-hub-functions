module.exports = async (draft, { sql, user }) => {
  const routeTo = {
    exit: "Output#2",
  };
  // const setFailedResponse = (msg, statusCd = 400) => {
  //   draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
  //   draft.response.statusCode = statusCd;
  //   draft.json.nextNodeKey = routeTo.exit;
  // };

  const { requestData, tableConfig } = draft.json;
  const { rows } = requestData;
  const { tableName, primaryKeys } = tableConfig;

  const mysql = sql("mysql");
  const sqlPromises = rows.map((row) =>
    mysql
      .update(tableName, {
        // 계정코드
        ACCOUNT_CD: row.ACCOUNT_CD,
        ACCOUNT_NAME: row.ACCOUNT_NAME,
        // 세금코드
        TAX_CD: row.TAX_CD,
        TAX_NAME: row.TAX_NAME,
        // 계정지정유형
        ACCOUNT_DESIGNATION_TYPE_CD: row.ACCOUNT_DESIGNATION_TYPE_CD,
        // 코스트센터
        COST_CENTRE_NO: row.COST_CENTRE_NO,
        COST_CENTRE_NAME: row.COST_CENTRE_NAME,
        // 프로젝트
        PROJECT_NO: row.PROJECT_NO,
        PROJECT_NAME: row.PROJECT_NAME,
        // 판매오더
        SALES_ORDER_NO: row.SALES_ORDER_NO,
        SALES_ORDER_NAME: row.SALES_ORDER_NAME,
        // 판매오더아이템
        SALES_ORDER_ITEM_NO: row.SALES_ORDER_ITEM_NO,
        SALES_ORDER_ITEM_NAME: row.SALES_ORDER_ITEM_NAME,
        // 불공제사유
        NON_DEDUCTION_REASON_CD: row.NON_DEDUCTION_REASON_CD,
        // 적요
        SUMMARY: row.SUMMARY,
        // 업데이트한 사용자
        UPDATED_BY: user.id,
        // 업데이트 날짜
        UPDATED_AT: mysql.fn.now(6),
        COMPLETED_WRITING: row.COMPLETED_WRITING,
      })
      .where({
        HIST_ROW_KEY: row.HIST_ROW_KEY,
      })
      .onConflict(primaryKeys)
      .ignore()
      .run()
  );

  // DB 테이블 동시 업데이트 진행
  const dbUpdateResult = await Promise.all(sqlPromises);

  draft.response.body = { E_STATUS: "S", dbUpdateResult };
  draft.json.nextNodeKey = routeTo.exit;
};
