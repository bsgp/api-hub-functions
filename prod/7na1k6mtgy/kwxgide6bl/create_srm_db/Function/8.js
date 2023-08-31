module.exports = async (draft, { sql }) => {
  const spec = draft.pipe.json.tables.IDN_ITEMS;

  const setTable = (table) => {
    table.charset("utf8mb4");
    table.string("IDN_ID").notNullable();
    table.string("IDN_ITEM_ID").notNullable();
    table.string("PO_ITEM_ID").notNullable();
    table.string("PO_NUMBER").notNullable();
    table.string("MAT_ID").notNullable();
    table.string("MAT_TEXT").defaultTo("");
    table.decimal("PO_QTY").notNullable();
    table.decimal("IDN_QTY").notNullable();
    table.string("UNIT").defaultTo("");
    table.string("BATCH_ID").defaultTo("");
    table.datetime("PROD_DATE", { precision: 6 }).defaultTo(null);
    table.datetime("EXPIRED_DATE", { precision: 6 }).defaultTo(null);
    table.boolean("IS_ORIGIN").defaultTo("");
    table.boolean("DELETED").notNullable().defaultTo(false);
    table.datetime("CREATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
    table.datetime("UPDATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
    table.string("CREATED_BY").defaultTo("");
    table.string("UPDATED_BY").defaultTo("");
    table.primary(["IDN_ID", "IDN_ITEM_ID"]);
  };

  const mysql = sql("mysql");

  const result = await mysql.table.create(spec.name, setTable).run();

  draft.response.body[spec.name] =
    result.statusCode === 200 ? "Succeed" : result.body;
};
