module.exports = async (draft, { sql }) => {
  // your script
  const { comments, commentsHistory, commentsFiles } = draft.pipe.json.tables;
  const mysql = sql("mysql");
  const commentsResult = await mysql.table
    .create(comments.name, function (table) {
      table.charset("utf8mb4");
      table.string("menu_id").notNullable();
      table.string("comment_id").notNullable();
      table.string("brief_text");
      table.string("requester");
      table.date("req_date");
      table.boolean("deleted").defaultTo(false);
      table.primary(["menu_id", "comment_id"]);
      table.datetime("created_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.datetime("updated_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
    })
    .run();

  const commentsHistoryResult = await mysql.table
    .create(commentsHistory.name, function (table) {
      table.charset("utf8mb4");
      table.string("menu_id").notNullable();
      table.string("comment_id");
      table.string("history_id").notNullable();
      table.string("name");
      table.string("new_value");
      table.string("old_value");
      table.primary(["menu_id", "comment_id", "history_id"]);
      table.datetime("created_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.datetime("updated_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
    })
    .run();

  const commentsFilesResult = await mysql.table
    .create(commentsFiles.name, function (table) {
      table.charset("utf8mb4");
      table.string("menu_id").notNullable();
      table.string("comment_id").notNullable();
      table.string("file_id").notNullable();
      table.string("name");
      table.string("hash");
      table.integer("size");
      table.string("path");
      table.primary(["menu_id", "comment_id", "file_id"]);
      table.datetime("created_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
      table.datetime("updated_at", { precision: 6 }).defaultTo(mysql.fn.now(6));
    })
    .run();

  draft.response.body[comments.name] = commentsResult;
  draft.response.body[commentsHistory.name] = commentsHistoryResult;
  draft.response.body[commentsFiles.name] = commentsFilesResult;
};
