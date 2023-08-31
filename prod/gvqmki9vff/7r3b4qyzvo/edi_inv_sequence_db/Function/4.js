module.exports = async (draft, { sql }) => {
  const spec = draft.pipe.json.tables.Invoice;

  const mysql = sql("mysql");
  const result = await mysql.table
    .create(spec.name, function (table) {
      table.charset("utf8mb4");
      table.integer("ID").notNullable();
      table.string("INV_ID").notNullable();
      table.string("CUSTOMER").notNullable();
      table.boolean("DELETED").notNullable().defaultTo(false);
      table.datetime("CREATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.datetime("UPDATED_AT", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.string("CREATED_BY").defaultTo("IHub");
      table.string("UPDATED_BY").defaultTo("IHub");
      table.primary(["ID", "CUSTOMER"]);
    })
    .run();

  draft.response.body[spec.name] =
    result.statusCode === 200 ? "Succeed" : result.body;
};
