module.exports = async (draft, { sql }) => {
  /** set spec */
  const spec = draft.json.tables.sample;
  // , { useCustomRole: false }
  const mysql = sql("mysql");
  const result = await mysql.table
    .create(spec.name, function (table) {
      table.charset("utf8mb4");
      table.string("id").notNullable();
      table.string("text").defaultTo("");

      table.primary(["id"]);
    })
    .run();

  // draft.response.body[spec.name] =
  //   result.statusCode === 200 ? "Succeed" : result.body;
  draft.response.body[spec.name] = result;

  // table.boolean("deleted").notNullable().defaultTo(false);
  // table.datetime("created_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
  // table.datetime("updated_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
  // table.string("created_by").defaultTo("");
  // table.string("updated_by").defaultTo("");
};
