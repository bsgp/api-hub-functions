module.exports = async (draft, { env, sql }) => {
  const { confirmationjournal } = draft.pipe.json.tables;

  const setTable = (table) => {
    table.charset("utf8mb4");
    table.string("CCONF_ID").notNullable(); // 확인문 ID
    table.string("CBT_POSTING_DATE").notNullable(); // 전기일
    table.string("CCANC_STATUS").defaultTo(""); // 취소여부
    table.string("CCONF_TYPE").defaultTo(""); // 확인 문서 유형
    table.string("CCONF_UNIT").defaultTo(""); // 확인된 수량 단위
    table.string("CINVCH_REASON").defaultTo(""); // 재고변경사유 코드
    table.string("CISTOCK_UUID").defaultTo(""); // 동종 재고 ID
    table.string("CITEM_ID").defaultTo(""); // 확정 품목 ID
    table.string("CLOG_AREA_UUID").defaultTo(""); // 물류영역
    table.string("CLOG_CONF_TYPE").defaultTo(""); // 확정유형 ID
    table.string("CMATERIAL_UUID").defaultTo(""); // 제품 ID
    table.string("CMOVE_DIRECTION").defaultTo(""); // 재고 이동 방향 코드
    table.string("CPROD_TASK_ID").defaultTo(""); // 프로젝트 태스크 ID
    table.string("CREF_ID").defaultTo(""); // 참조 문서ID
    table.string("CREF_MST_ID").defaultTo(""); // 원본 문서 ID
    table.string("CREF_MST_TYPE").defaultTo(""); // 원본 문서 유형 코드
    table.string("CREF_TYPE").defaultTo(""); // 참조 문서 유형 코드
    table.string("CSITE_UUID").defaultTo(""); // 사이트 ID
    table.string("CTA_DATE").defaultTo(""); // 실제 실행일
    table.string("KCCONFIRMED_QUANTITY").defaultTo(""); // 확인된 수량
    table.string("KCINV_QUAN_NORMAL").defaultTo(""); // 유효수량
    table.string("TINVCH_REASON").defaultTo(""); // 재고변경사유
    table.string("TISTOCK_UUID").defaultTo(""); // 동종재고 텍스트
    table.string("TMOVE_DIRECTION").defaultTo(""); // 재고 이동 방향 텍스트
    table.string("TREF_MST_TYPE").defaultTo(""); // 원본 문서 유형 텍스트
    table.string("TREF_TYPE").defaultTo(""); // 참조 문서 유형 텍스트
    table.string("TSITE_UUID").defaultTo(""); // 사이트 텍스트
    table.string("UCINV_QUAN_NORMAL").defaultTo(""); // 유효 수량 단위
    table.string("C1ISTOCK_UUIDsSUPPLIER_ID").defaultTo(""); // 공급사ID
    table.string(env.CF_FULLNAME).defaultTo(""); // 풀네임
    table.string(env.CF_PROD_DATE).defaultTo(""); // 동종재고 생산일
    table.string(env.CF_DIMENSION).defaultTo(""); // dimension
    table.string(env.CF_LOCATION).defaultTo(""); // location
    table.string(env.CF_SALES_ORDER_ID).defaultTo(""); // salesOrderID
    table.string(env.CF_DATE_VALID_UNTIL).defaultTo(""); // dateValidUntil
    table.string(env.CF_NOT_INSPECTION).defaultTo(""); // notInspection
    table.string("CCH_DATE").defaultTo(""); // 변경일일
    table.datetime("CREATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
    table.primary(["CCONF_ID", "CISTOCK_UUID", "CITEM_ID"]);
  };

  const mysql = sql("mysql");

  const confirmationjournalDB = await mysql.table
    .create(confirmationjournal.name, setTable)
    .run();

  draft.response.body[confirmationjournalDB.name] = confirmationjournalDB;
};
