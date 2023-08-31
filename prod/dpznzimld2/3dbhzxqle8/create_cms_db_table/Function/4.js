module.exports = async (draft, { sql }) => {
  const spec = draft.pipe.json.tables.system;

  const mysql = sql("mysql");
  const result = await mysql.table
    .create(spec.name, function (table) {
      table.charset("utf8mb4");
      table.string("SYSTEM_ID").notNullable();
      table.string("COMPANY_ID").defaultTo("");
      table.string("IMPORT").defaultTo("");
      table.string("EXPORT").defaultTo("");
      table.boolean("SELECTED").notNullable().defaultTo(false);
      table.boolean("DELETED").notNullable().defaultTo(false);
      table.datetime("CREATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.datetime("UPDATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.string("CREATED_BY").defaultTo("");
      table.string("UPDATED_BY").defaultTo("");
      table.primary(["SYSTEM_ID"]);
    })
    .run();

  draft.response.body[spec.name] =
    result.statusCode === 200 ? "Succeed" : result.body;
};
