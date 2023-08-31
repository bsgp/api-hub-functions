module.exports = async (draft, { sql }) => {
  // const spec = draft.pipe.json.tables.system;

  // const mysql = sql(t"mysql");
  // const result = await mysql.table
  //   .create(spec.name, function (table) {
  //     table.charset("utf8mb4");
  //     table.string("SYSTEM_ID").notNullable();
  //     table.string("COMPANY_ID").defaultTo("");
  //     table.string("IMPORT").defaultTo("");
  //     table.string("EXPORT").defaultTo("");
  //     table.boolean("DELETED").notNullable().defaultTo(false);
  //     table.datetime("CREATED_AT",
  // { precision: 6 }).defaultTo(mysql.fn.now(6));
  //     table.datetime("UPDATED_AT",
  // { precision: 6 }).defaultTo(mysql.fn.now(6));
  //     table.string("CREATED_BY").defaultTo("");
  //     table.string("UPDATED_BY").defaultTo("");
  //     table.primary(["SYSTEM_ID"]);
  //   })
  //   .run();
  // draft.response.body[spec.name] =
  //   result.statusCode === 200 ? "Succeed" : result.body;

  // const mysql = sql("mysql");
  // const result = await mysql.table
  //   .create("ftdb_test", function (table) {
  //     table.charset("utf8mb4");
  //     // table.SMALLINT("TEST_ID").defaultTo(0).au
  //     table.string("TEST_DEFECT").notNullable().defaultTo("");
  //     table.string("TEST_GS3A").defaultTo("0");
  //     table.string("TEST_GS3B").defaultTo("0");
  //     table.string("TEST_GS4A").defaultTo("0");
  //     table.string("TEST_GS4B").defaultTo("0");
  //     table.primary(["TEST_DEFECT"]);
  //   })
  //   .run();

  // const mysql = sql("mysql");
  // const result = await mysql.table
  //   .create("ftdb_cutting2", function (table) {
  //     table.charset("utf8mb4");
  //     table.string("USER_KEY").notNullable();
  //     table.string("DEFEC_DETAILS").notNullable();
  //     table.integer("GS3_A").defaultTo(0);
  //     table.integer("GS3_B").defaultTo(0);
  //     table.integer("GS4_A").defaultTo(0);
  //     table.integer("GS4_B").defaultTo(0);
  //     table.integer("TOTAL").defaultTo(0);
  //     // table.primary(["USER_KEY", DEFEC_DETAILS])
  //   })
  //   .run();

  const mysql = sql("mysql");
  const result = await mysql.table
    .create("ftdb_cutting5", function (table) {
      table.charset("utf8mb4");
      table.string("USER_KEY").notNullable();
      table.string("DEFEC_DETAILS").notNullable();
      table.string("GS3_A").defaultTo("0");
      table.string("GS3_B").defaultTo("0");
      table.string("GS4_A").defaultTo("0");
      table.string("GS4_B").defaultTo("0");
      table.string("TOTAL").defaultTo("0");
      table.primary(["USER_KEY"]);
    })
    .run();

  draft.response.body = result;
};
