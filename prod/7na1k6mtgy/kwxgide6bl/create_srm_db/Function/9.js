module.exports = async (draft, { sql }) => {
  const spec = draft.pipe.json.tables.ORDER_ITEMS;

  const setTable = (table) => {
    table.charset("utf8mb4");
    table.string("PO_NUMBER").notNullable();
    table.string("ITEM_ID").notNullable();
    table.string("MAT_ID").notNullable();
    table.string("MAT_TEXT").defaultTo("");
    table.decimal("PO_QTY").notNullable();
    table.decimal("DEL_QTY").notNullable().defaultTo(0);
    table.decimal("REST_QTY").notNullable();
    table.string("UNIT").defaultTo("");
    table.integer("IDN_CREATED_NUMBER").defaultTo(0);
    table.boolean("DELETED").notNullable().defaultTo(false);
    table.datetime("CREATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
    table.datetime("UPDATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
    table.string("CREATED_BY").defaultTo("");
    table.string("UPDATED_BY").defaultTo("");
    table.primary(["PO_NUMBER", "ITEM_ID"]);
  };

  const mysql = sql("mysql");

  const result = await mysql.table.create(spec.name, setTable).run();

  draft.response.body[spec.name] = result;
};
