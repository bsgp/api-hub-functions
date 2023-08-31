module.exports = async (draft, { sql }) => {
  const spec = draft.pipe.json.tables.IDN_HEADER;

  const mysql = sql("mysql");
  const result = await mysql.table
    .create(spec.name, function (table) {
      table.charset("utf8mb4");
      table.string("PO_NUMBER").notNullable();
      table.string("IDN_ID").notNullable();
      table.string("VENDOR").defaultTo("");
      table.string("VEND_NAME").defaultTo("");
      table.string("PURCHASE_GROUP").defaultTo("");
      table.string("PUR_GROUP_NAME").defaultTo("");
      table.string("NET_VALUE").defaultTo("");
      table.string("CURRENCY").defaultTo("");
      table.string("DOC_DATE").defaultTo("");
      table.string("ARRIVE_DATE").defaultTo("");
      table.string("PLANT_TEXT").defaultTo("");
      table.string("SHIP_TO").defaultTo("");
      table.string("TEL").defaultTo("");
      table.string("EMAIL").defaultTo("");
      table.string("IDN_DESC").defaultTo("");
      table.boolean("DELETED").notNullable().defaultTo(false);
      table.datetime("CREATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.datetime("UPDATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.string("CREATED_BY").defaultTo("");
      table.string("UPDATED_BY").defaultTo("");
      table.primary(["PO_NUMBER", "IDN_ID"]);
    })
    .run();

  draft.response.body[spec.name] =
    result.statusCode === 200 ? "Succeed" : result.body;
};
