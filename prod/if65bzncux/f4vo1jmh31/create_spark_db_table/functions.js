module.exports.change = (mysql) => (table) => {
  table.charset("utf8mb4");

  table.string("type", 10).notNullable();
  table.string("row_key", 20).notNullable();
  table.string("id", 5).notNullable();

  table.string("changed_by", 30).defaultTo("");
  table.datetime("changed_by", { precision: 6 }).defaultTo(mysql.fn.now(6));
  table.json("content");

  table.primary(["type", "row_key", "id"]);
};

module.exports.contract = (table) => {
  table.charset("utf8mb4");
};

module.exports.ref_doc = (table) => {
  table.charset("utf8mb4");
};

module.exports.cost_object = (table) => {
  table.charset("utf8mb4");
};

module.exports.bill = (table) => {
  table.charset("utf8mb4");
};

module.exports.party = (table) => {
  table.charset("utf8mb4");
};

module.exports.letter_appr = (table) => {
  table.charset("utf8mb4");
};
