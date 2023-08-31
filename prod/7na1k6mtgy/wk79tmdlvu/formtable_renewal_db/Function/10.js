module.exports = async (draft, { sql }) => {
  const mysql = sql("mysql");
  // const result = await mysql.table
  //   .alter("ftdb_test", function (table) {
  //     table.charset("utf8mb4");
  //     // table.SMALLINT("TEST_ID").defaultTo(0)
  //     table.string("TEST_DEFECT").notNullable().defaultTo("");
  //     table.string("TEST_GS3A").defaultTo("0");
  //     table.string("TEST_GS3B").defaultTo("0");
  //     table.string("TEST_GS4A").defaultTo("0");
  //     table.string("TEST_GS4B").defaultTo("0");
  //     table.primary(["TEST_DEFECT"]);
  //   })
  //   .run();

  const result = await mysql.table
    .raw('select * from "TEST_GS3A" where "TEST_DEFECT" = 거친절삭', "Test")
    .run();

  // const result = await mysql.table.alter("ftdb_test", function (table) {
  //   // table.SMALLINT("TEST_ID").defaultTo(0)
  //   table.string("DEFECT").notNullable().defaultTo("");
  //   table.string("GS3A").defaultTo("0");
  //   table.string("GS3B").defaultTo("0");
  //   table.string("GS4A").defaultTo("0");
  //   table.string("GS4B").defaultTo("0");
  //   table.primary(["DEFECT"]);
  // });

  draft.response.body = result;
};
