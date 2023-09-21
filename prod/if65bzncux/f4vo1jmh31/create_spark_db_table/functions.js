/**
 * 외주계약_프로세스 DB Schema 정보
 * drive.google.com/file/d/1YXp3TdJN24BRA3Y0_2ZFSbPSPH2kf_Xw/view?ts=64f6adc3
 */

/** TABLE: change */
module.exports.change =
  ({ mysql, makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("type", 10).notNullable(); // Master, Contract, Project, Bill..
    table.string("row_key", 20).notNullable(); // 행의 키필드.join("#")
    table.string("id", 5).defaultTo(makeid(5)); // makeid()

    table.string("changed_by", 30).defaultTo(""); // 변경자
    table.datetime("changed_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
    // 변경일시
    table.json("content"); // json 타입

    table.primary(["type", "row_key", "id"]);
  };

/** TABLE: contract */
module.exports.contract =
  ({ mysql }) =>
  (table) => {
    table.charset("utf8mb4");

    table.increments("id");

    table.string("prod_date", 8).defaultTo(""); // 계약작성일
    table.string("bukrs", 4).defaultTo(""); // 회사코드(기본값: 로그인한 회사코드)
    table.string("name", 200).defaultTo(""); // 계약명
    table.string("type", 1).defaultTo(""); // 계약유형
    table.string("start_date", 8).defaultTo(""); // 계약시작일
    table.string("end_date", 8).defaultTo(""); //계약종료일
    table.boolean("renewal_ind"); // 자동연장 지시자
    table.string("renewal_period", 3).defaultTo(""); // 자동연장기간 (기본값: "1Y")
    table.string("curr_key", 5).defaultTo("");
    // KRW,USD,JPY..(기본값: 로그인 회사코드 기본 통화)
    table.decimal("dmbtr", 23, 2).defaultTo(0); // curr_key와 매칭되는 금액
    table.decimal("dmbtr_local", 23, 2).defaultTo(0);
    // curr_key와 curr_local이 다를 경우 필수 입력
    table.string("curr_local", 5).defaultTo(""); // 기본값: 로그인 회사 기본통화키
    table.string("status", 3).defaultTo(""); // 상태
    table.datetime("created_at", { precision: 6 }).defaultTo(mysql.fn.now(6));

    table.primary(["id"]);
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
    table.string("cost_type", 3).defaultTo("");
    // 귀속 유형(cf: to-be 리스트파일 계약유형 시트)
    table.decimal("dmbtr", 23, 2).defaultTo(0);
    table.decimal("dmbtr_local", 23, 2).defaultTo(0);
    table.string("start_date", 8).defaultTo(""); // 시작일
    table.string("end_date", 8).defaultTo(""); // 종료일
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
    table.string("cost_object_id", 36).defaultTo(""); // 귀속처
    table.string("reason_text", 200).defaultTo(""); // 미청구 사유
    table.decimal("dmbtr", 23, 2).defaultTo(0);
    table.decimal("dmbtr_local", 23, 2).defaultTo(0);
    table.string("curr_key", 5).defaultTo("");
    table.string("curr_local", 5).defaultTo("");
    table.string("post_date", 8).defaultTo(""); // 청구예정일일
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
    table.string("stems10_cn", 1).defaultTo("");
    // 甲(갑) 乙(을) 丙(병) 丁(정) 戊(무) 己(기) 庚(경) 辛(신) 壬(임) 癸(계)
    table.string("stems10_ko", 1).defaultTo("");
    // 甲(갑) 乙(을) 丙(병) 丁(정) 戊(무) 己(기) 庚(경) 辛(신) 壬(임) 癸(계)
    table.string("name", 100).defaultTo(""); // 상호
    table.string("ref_id", 36).defaultTo(""); // 회사 코드, BP코드
    table.string("type", 5).defaultTo(""); // 회사 타입
    table.boolean("deleted").defaultTo(false);

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
    table.string("ext", 10).defaultTo("");
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
