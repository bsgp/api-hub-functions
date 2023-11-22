/**
 * 외주계약_프로세스 DB Schema 정보
 * drive.google.com/file/d/1YXp3TdJN24BRA3Y0_2ZFSbPSPH2kf_Xw/view?ts=64f6adc3
 */

/** TABLE: change */
module.exports.change =
  ({ mysql, makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("type", 15).notNullable(); // Master, Contract, Project, Bill..
    // cost_object 10자리로 하는 경우 잘림, 15로 수정
    table.string("row_key", 20).notNullable(); // 행의 키필드.join("#")
    table.string("id", 5).defaultTo(makeid(5)); // makeid()

    table.string("changed_by", 30).defaultTo(""); // 변경자
    table.datetime("changed_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
    // 변경일시
    table.string("operation", 1).defaultTo(""); // I(insert), U(update)
    table.json("content"); // json 타입

    table.primary(["type", "row_key", "id"]);
  };

/** TABLE: contract */
module.exports.contract =
  ({ mysql }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("id", 10).notNullable();

    table.string("prod_date", 8).defaultTo(""); // 계약작성일
    table.string("bukrs", 4).defaultTo(""); // 회사코드(기본값: 로그인한 회사코드)
    table.string("name", 200).defaultTo(""); // 계약명
    table.string("type", 1).defaultTo(""); // 계약유형
    table.string("start_date", 8).defaultTo(""); // 계약시작일
    table.string("end_date", 8).defaultTo(""); //계약종료일
    table.boolean("renewal_ind"); // 자동연장 지시자
    table.string("renewal_period", 3).defaultTo(""); // 자동연장기간 (기본값: "1Y")
    table.decimal("dmbtr_supply", 23, 2).defaultTo(0); // 공급가액
    table.decimal("dmbtr_vat", 23, 2).defaultTo(0); // 부과세
    table.decimal("dmbtr", 23, 2).defaultTo(0); // curr_key와 매칭되는 금액
    table.decimal("dmbtr_supply_local", 23, 2).defaultTo(0); // 로컬 공급가액
    table.decimal("dmbtr_vat_local", 23, 2).defaultTo(0); // 로컬 부과세
    table.decimal("dmbtr_local", 23, 2).defaultTo(0);
    table.string("curr_key", 5).defaultTo("");
    // KRW,USD,JPY..(기본값: 로그인 회사코드 기본 통화)
    table.string("curr_local", 5).defaultTo(""); // 기본값: 로그인 회사 기본통화키
    // curr_key와 curr_local이 다를 경우 필수 입력
    table.string("status", 3).defaultTo(""); // 상태
    table.string("seq", 3).defaultTo("0"); // 회차
    table.string("payment_terms", 20).defaultTo(""); // 지급조건
    table.string("claims_time", 20).defaultTo(""); // 청구시점
    table.string("contract_deposit", 20).defaultTo(""); // 계약이행보증
    table.string("f_payment_return_deposit ", 20).defaultTo(""); // 선급금보증
    table.string("warr_haja_deposit ", 20).defaultTo(""); // 하자이행보증
    table.string("delayed_money", 20).defaultTo(""); // 지체상금율
    table.string("etc", 200).defaultTo(""); // 기타
    table.string("uni_contno", 20).defaultTo(""); // 계약관리번호
    table.string("uni_contseq", 3).defaultTo(""); //  계약관리 일련번호
    table.string("uni_coregno", 10).defaultTo(""); // 계약소유자 사업자등록번호
    table.string("uni_contname", 200).defaultTo(""); // 계약명
    table.string("uni_contdate", 8).defaultTo(""); // 계약일자(yyyyMMdd)
    table.string("uni_contsts", 3).defaultTo(""); // 계약상태코드
    table.string("uni_contstsname", 3).defaultTo(""); // 계약상태명
    table.datetime("created_at", { precision: 6 }).defaultTo(mysql.fn.now(6));

    table.primary(["id"]);
  };

/** TABLE: changed_contract */
module.exports.changed_contract = () => (table) => {
  table.charset("utf8mb4");

  table.string("contract_id", 10).notNullable();
  table.string("seq", 3).notNullable(); // 계약차수

  table.json("json"); // json 타입
  table.json("before").defaultTo("");
  table.json("after").defaultTo("");

  table.primary(["contract_id", "seq"]);
};

/** TABLE: ref_doc */
module.exports.ref_doc =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5)); // makeid()

    table.string("index", 5).defaultTo("");
    table.string("type", 5).defaultTo(""); // MM, FI
    table.string("item_id", 5).defaultTo(""); // 아이템 ID
    table.string("doc_id", 36).defaultTo(""); // SAP 구매오더번호, 회계전표..
    table.boolean("deleted").defaultTo(false);

    table.primary(["contract_id", "id"]);
  };

/** TABLE: cost_object */
module.exports.cost_object =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5)); // makeid()

    table.string("index", 5).defaultTo("");
    table.string("type", 3).defaultTo(""); // 귀속처유형(WBS, 코스트센터)
    table.string("cost_object_id", 36).defaultTo(""); // 귀속처(WBS, 코스트센터)
    table.string("name", 100).defaultTo(""); // 귀속처 명
    table.string("cost_type_id", 10).defaultTo("");
    table.string("cost_type", 100).defaultTo("");
    // 귀속 유형(cf: to-be 리스트파일 계약유형 시트)
    table.string("matnr", 18).defaultTo(""); // 자재코드
    table.string("maktx", 50).defaultTo(""); // 자재명
    table.decimal("dmbtr_supply", 23, 2).defaultTo(0);
    table.decimal("dmbtr_supply_local", 23, 2).defaultTo(0);
    table.decimal("dmbtr_vat", 23, 2).defaultTo(0);
    table.decimal("dmbtr_vat_local", 23, 2).defaultTo(0);
    table.string("po_number ", 10).defaultTo(""); // 구매오더번호
    table.string("po_item_no", 10).defaultTo(""); // 구매오더항목번호
    table.string("post_date", 8).defaultTo(""); // 청구예정일
    table.string("loekz", 1).defaultTo(""); // 삭제지시자(구매)
    table.boolean("deleted").defaultTo(false);

    table.primary(["contract_id", "id"]);
  };

/** TABLE: actual_billing */
module.exports.actual_billing =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5)); // makeid()

    table.string("index", 5).defaultTo("");
    table.string("parent_id", 5).defaultTo("");
    table.string("type", 3).defaultTo(""); // 귀속처유형(WBS, 코스트센터)
    table.string("cost_object_id", 36).defaultTo(""); // 귀속처(WBS, 코스트센터)
    table.string("name", 100).defaultTo(""); // 귀속처 명
    table.string("cost_type_id", 10).defaultTo("");
    table.string("cost_type", 100).defaultTo("");
    table.string("gl_account_id", 18).defaultTo("");
    table.string("gl_account", 100).defaultTo("");
    // 귀속 유형(cf: to-be 리스트파일 계약유형 시트)
    table.decimal("dmbtr_supply", 23, 2).defaultTo(0);
    table.decimal("dmbtr_supply_local", 23, 2).defaultTo(0);
    table.decimal("dmbtr_vat", 23, 2).defaultTo(0);
    table.decimal("dmbtr_vat_local", 23, 2).defaultTo(0);
    table.string("fi_gjahr", 4).defaultTo(""); // 회계연도
    table.string("fi_number ", 10).defaultTo(""); // 회계전표번호
    table.string("fi_item_no", 4).defaultTo(""); // 회계전표항목번호
    table.string("post_date", 8).defaultTo(""); // 전기일
    table.string("docu_date", 8).defaultTo(""); // 증빙일
    table.string("remark", 100).defaultTo(""); // 비고
    table.boolean("deleted").defaultTo(false);

    table.primary(["contract_id", "id"]);
  };

/** TABLE: wbs */
module.exports.wbs =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5)); // makeid()

    table.string("index", 5).defaultTo("");
    table.string("seq", 3).defaultTo("0"); // 계약차수
    table.string("type", 3).defaultTo(""); // 귀속처유형(WBS, 코스트센터)
    table.string("cost_object_id", 36).defaultTo(""); // 귀속처(WBS, 코스트센터)
    table.string("name", 100).defaultTo(""); // 귀속처 명
    table.decimal("dmbtr", 23, 2).defaultTo(0);
    table.decimal("dmbtr_local", 23, 2).defaultTo(0);
    table.string("start_date", 8).defaultTo(""); // 시작일
    table.string("end_date", 8).defaultTo(""); // 종료일
    table.datetime("last_send_date ").defaultTo(null);
    table.boolean("deleted").defaultTo(false);

    table.primary(["contract_id", "id"]);
  };

/** TABLE: bill */
module.exports.bill =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5)); // makeid()

    table.string("index", 5).defaultTo("");
    // table.string("cost_object_id", 36).defaultTo(""); // 귀속처
    // table.string("reason_text", 200).defaultTo(""); // 미청구 사유
    table.decimal("dmbtr_supply", 23, 2).defaultTo(0);
    table.decimal("dmbtr_vat", 23, 2).defaultTo(0);
    table.string("remark", 200).defaultTo(""); // 비고
    table.string("curr_key", 5).defaultTo("");
    table.string("post_date", 8).defaultTo(""); // 청구예정일
    table.boolean("deleted").defaultTo(false);

    table.primary(["contract_id", "id"]);
  };

/** TABLE: party */
module.exports.party =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5)); // makeid()

    table.string("index", 5).defaultTo("");
    table.string("stems10", 1).defaultTo("");
    // 甲(갑) 乙(을) 丙(병) 丁(정) 戊(무) 己(기) 庚(경) 辛(신) 壬(임) 癸(계)
    table.string("stems10_cn", 1).defaultTo("");
    table.string("stems10_ko", 1).defaultTo("");
    table.string("name", 100).defaultTo(""); // 상호
    table.string("ref_id", 36).defaultTo(""); // 회사 코드, BP코드
    table.string("type", 5).defaultTo(""); // 회사 타입
    table.boolean("deleted").defaultTo(false);
    table.string("prdnt_name", 30).defaultTo("").comment("대표자 명");
    table.string("id_no", 20).defaultTo("").comment("사업자등록번호");
    table.string("biz_no", 20).defaultTo("").comment("법인등록번호");
    table.string("land_id", 2).defaultTo("").comment("국가키");
    table.string("address", 100).defaultTo("").comment("주소");
    table.string("tel", 20).defaultTo("").comment("연락처");
    table.string("gl_group_id", 20).defaultTo("").comment("계정그룹");
    table.string("gl_group_text", 20).defaultTo("").comment("계정그룹텍스트");

    table.primary(["contract_id", "id"]);
  };

/** TABLE: attachment */
module.exports.attachment =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5)); // makeid()

    table.string("index", 5).defaultTo("");
    table.string("type", 40).defaultTo("");
    table.string("name", 200).defaultTo("");
    table.string("desc", 50).defaultTo("").comment("파일명(계약서)");
    table.string("ext", 10).defaultTo("");
    table.string("path", 200).defaultTo("");
    table.boolean("deleted").defaultTo(false);

    table.primary(["contract_id", "id"]);
  };

/** TABLE: letter_appr */
module.exports.letter_appr =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5));

    table.primary(["contract_id", "id"]);
  };
