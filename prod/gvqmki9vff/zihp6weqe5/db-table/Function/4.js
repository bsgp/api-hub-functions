module.exports = async (draft, { sql }) => {
  const spec = draft.pipe.json.tables.log;

  const mysql = sql("mysql");
  const result = await mysql.table
    .create(spec.name, function (table) {
      table.charset("utf8mb4");
      // COMPONENT_CHECK || PROD_CONFIRMATION || PROD_PICKING ||
      // PUT_AWAY || BIN_TO_BIN
      table.string("TYPE").notNullable();
      table.string("MATERIAL_ID").notNullable();
      table.string("ISTOCK_ID").notNullable();
      table.string("QUANTITY").notNullable();
      table.string("AREA").notNullable();
      table.boolean("DELETED").notNullable().defaultTo(false);
      table.datetime("CREATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.datetime("UPDATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.string("CREATED_BY").defaultTo("");
      table.string("UPDATED_BY").defaultTo("");
      table.string("UNIQUE_KEY").defaultTo("");
      table.string("PRODUCTION_ORDER_ID").defaultTo("");
      table.string("PRODUCTION_TASK_ID").defaultTo("");
      table.string("TASK_STEP").defaultTo("");
      table.string("CONFIRMATION_ID").defaultTo("");
      table.string("RES_STATUS").defaultTo("");
      table.string("RES_DESC").defaultTo("");
      table.string("PAYLOAD_URL").defaultTo("");
      table.primary([
        "TYPE",
        "TASK_STEP",
        "MATERIAL_ID",
        "ISTOCK_ID",
        "QUANTITY",
        "AREA",
        "CREATED_AT",
        "CREATED_BY",
        "UNIQUE_KEY",
      ]);
    })
    .run();

  draft.response.body = {};
  draft.response.body[spec.name] =
    result.statusCode === 200 ? "Succeed" : result.body;
};
