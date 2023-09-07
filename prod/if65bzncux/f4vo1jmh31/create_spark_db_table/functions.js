/** TABLE: change */
module.exports.change =
  ({ mysql }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("type", 10).notNullable();
    table.string("row_key", 20).notNullable();
    table.string("id", 5).notNullable();

    table.string("changed_by", 30).defaultTo("");
    table.datetime("changed_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
    table.json("content");

    table.primary(["type", "row_key", "id"]);
  };

/** TABLE: contract */
module.exports.contract = () => (table) => {
  table.charset("utf8mb4");

  table.string("id", 10).notNullable();

  table.string("prod_date", 8).defaultTo("");
  table.string("bukrs", 4).defaultTo("");
  table.string("name", 200).defaultTo("");
  table.string("type", 1).defaultTo("");
  table.string("start_date", 8).defaultTo("");
  table.string("end_date", 8).defaultTo("");
  table.boolean("renewal_ind", 30);
  table.string("renewal_period", 3).defaultTo("");
  table.string("curr_key", 5).defaultTo("");
  table.decimal("dmbtr", 23, 2).defaultTo(0);
  table.decimal("dmbtr_local", 23, 2).defaultTo(0);
  table.string("curr_local", 5).defaultTo("");
  table.string("status", 3).defaultTo("");

  table.primary(["id"]);
};

/** TABLE: ref_doc */
module.exports.ref_doc =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5));

    table.string("type", 5).defaultTo("");
    table.string("item_id", 5).defaultTo("");
    table.string("doc_id", 36).defaultTo("");

    table.primary(["contract_id", "id"]);
  };

/** TABLE: cost_object */
module.exports.cost_object =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5));

    table.string("type", 3).defaultTo("");
    table.string("cost_object_id", 36).defaultTo("");
    table.string("name", 100).defaultTo("");
    table.string("cost_type", 3).defaultTo("");
    table.decimal("dmbtr", 23, 2).defaultTo(0);
    table.decimal("dmbtr_local", 23, 2).defaultTo(0);
    table.string("start_date", 8).defaultTo("");
    table.string("end_date", 8).defaultTo("");

    table.primary(["contract_id", "id"]);
  };

/** TABLE: bill */
module.exports.bill =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5));

    table.string("cost_object_id", 36).defaultTo("");
    table.string("reason_text", 200).defaultTo("");
    table.decimal("dmbtr", 23, 2).defaultTo(0);
    table.decimal("dmbtr_local", 23, 2).defaultTo(0);
    table.string("curr_key", 5).defaultTo("");
    table.string("curr_local", 5).defaultTo("");

    table.primary(["contract_id", "id"]);
  };

/** TABLE: party */
module.exports.party =
  ({ makeid }) =>
  (table) => {
    table.charset("utf8mb4");

    table.string("contract_id", 10).notNullable();
    table.string("id", 5).defaultTo(makeid(5));

    table.string("stems10_cn", 1).defaultTo("");
    table.string("stems10_ko", 1).defaultTo("");
    table.string("name", 100).defaultTo("");
    table.string("id", 36).defaultTo("");
    table.string("type", 5).defaultTo("");

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
