module.exports = async (draft, { file, log, sql }) => {
  const tables = {
    testLog: {
      name: "LOG_LG_DM",
      desc: "LG DM Transaction log",
    },
  };

  const uploadConfig = await file.upload("config/tables.json", tables, {
    gzip: true,
  });
  log("upload tables config:", uploadConfig);

  const spec = tables.log;

  const mysql = sql("mysql");

  const result = await mysql.table
    .create(spec.name, function (table) {
      table.charset("utf8mb4");
      table.string("DOC_ID").notNullable();
      table.string("TYPE", 6).defaultTo("");
      table.boolean("DELETED").notNullable().defaultTo(false);
      table.datetime("CREATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.datetime("UPDATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.string("CREATED_BY", 6).defaultTo("");
      table.string("UPDATED_BY", 6).defaultTo("");
      table.primary(["DOC_ID", "TYPE"]);
    })
    .run();

  draft.response.body[spec.name] =
    result.statusCode === 200 ? "Succeed" : result.body;
};
