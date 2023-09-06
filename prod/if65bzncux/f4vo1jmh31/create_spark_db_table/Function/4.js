module.exports = async (draft, { sql }) => {
  /** set spec */
  const spec = draft.json.tables.sample;

  // const mysql = sql("mysql", { useCustomRole: false });
  const result = await sql("mysql", { useCustomRole: false })
    .table.create(spec.name, function (table) {
      table.charset("utf8mb4");
      table.string("id").notNullable();
      table.string("text").defaultTo("");

      table.primary(["id"]);
    })
    .run();

  draft.response.body[spec.name] =
    result.statusCode === 200 ? "Succeed" : result.body;

  // table.boolean("deleted").notNullable().defaultTo(false);
  // table.datetime("created_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
  // table.datetime("updated_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
  // table.string("created_by").defaultTo("");
  // table.string("updated_by").defaultTo("");
};
