module.exports = async (draft, { sql }) => {
  const mysql = sql("mysql");
  let result = [];

  const { tbOpr, tbDef, tbMap, tbData } = draft.json;

  try {
    const def_table = await mysql.table
      .create(tbDef, function (table) {
        table.charset("utf8mb4");
        table.string("cd_def").notNullable();
        table.string("txt_def").notNullable();
        table.string("cd_opr").notNullable();
        table.primary("cd_def");
      })
      .run();

    const opr_table = await mysql.table
      .create(tbOpr, function (table) {
        table.charset("utf8mb4");
        table.string("cd_opr").notNullable();
        table.string("txt_opr").notNullable();
        table.primary("cd_opr");
      })
      .run();

    const mapping_table = await mysql.table
      .create(tbMap, function (table) {
        table.charset("utf8mb4");
        table.integer("row_idx");
        table.integer("col_idx");
        table.json("key_json").notNullable();
        table.primary(["row_idx", "col_idx"]);
      })
      .run();

    const data_table = await mysql.table
      .create(tbData, function (table) {
        table.charset("utf8mb4");
        table.string("date_ymd", 10);
        table.string("file_url", 255);
        table.string("team", 1).notNullable();
        table.string("machine", 10).notNullable();
        table.string("cd_def", 5);
        table.string("spec", 20).notNullable();
        table.string("product", 20).notNullable();
        table.integer("value").default(0);
        table.string("char_value").default("");
        table.primary([
          "file_url",
          "date_ymd",
          "spec",
          "product",
          "team",
          "machine",
          "cd_def",
        ]);
      })
      .run();

    result.push(def_table, opr_table, mapping_table, data_table);
    result.push(data_table);
  } catch (err) {
    result = err;
  }

  draft.response.body = result;
};
