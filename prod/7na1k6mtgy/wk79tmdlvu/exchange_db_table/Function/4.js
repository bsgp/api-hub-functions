module.exports = async (draft, { sql }) => {
  const spec = draft.pipe.json.tables.log;

  const mysql = sql("mysql");
  const result = await mysql.table
    .create(spec.name, function (table) {
      table.charset("utf8mb4");
      table.string("BASIC_DATE").notNullable();
      table.string("BASIC_SEQ").notNullable();
      table.string("CURR_CD").notNullable();
      table.string("BASIC_TIME").notNullable();
      table.string("BASIC_RATE").notNullable();
      table.boolean("DELETED").notNullable().defaultTo(false);
      table.datetime("CREATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.datetime("UPDATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.string("CREATED_BY").defaultTo("");
      table.string("UPDATED_BY").defaultTo("");
      table.string("RESULT").defaultTo("");
      table.string("CURR_NAME").defaultTo("");
      table.string("TT_SELL_RATE").defaultTo("");
      table.string("TT_BUY_RATE").defaultTo("");
      table.string("BKPR").defaultTo("");
      table.string("YY_EFEE_R").defaultTo("");
      table.string("TEN_DD_EFEE_R").defaultTo("");
      table.string("KFTC_BKPR").defaultTo("");
      table.string("KFTC_BASIC_RATE").defaultTo("");
      table.string("SENDER").defaultTo("");
      table.string("LAST_SENDER").defaultTo("");
      table.primary([
        "BASIC_DATE",
        "BASIC_SEQ",
        "CURR_CD",
        "BASIC_TIME",
        "BASIC_RATE",
      ]);
    })
    .run();

  draft.response.body = {};
  draft.response.body[spec.name] =
    result.statusCode === 200 ? "Succeed" : result.body;
};
