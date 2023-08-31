module.exports = async (draft, { sql }) => {
  // your script
  try {
    draft.json.nextNodeKey = "Function#4";
    // if (draft.response.body.E_STATUS !== "N") return;
    const { comments, commentsHistory, commentsFiles } = draft.pipe.json.tables;
    const mysql = sql("mysql");
    console.log("mysql", mysql);
    if (!mysql.hasTable("comments")) {
      const commentsResult = await mysql.table
        .create(comments.name, function (table) {
          table.string("MENU_ID").notNullable();
          table.string("COMMENT_ID").notNullable();
          table.string("BRIEF_TEXT");
          table.string("REQUESTER");
          table.date("REQ_DATE");
          table.primary(["MENU_ID", "COMMENT_ID"]);
        })
        .run();
      draft.response.body[comments.name] = commentsResult;
    }
    if (!mysql.hasTable("commentsHistory")) {
      const commentsHistoryResult = await mysql.table
        .create(commentsHistory.name, function (table) {
          table.string("MENU_ID").notNullable();
          table.string("COMMENT_ID").notNullable();
          table.string("HISTORY_ID").notNullable();
          table.string("NAME");
          table.string("NEW_VALUE");
          table.string("OLD_VALUE");
          table.string("ACTION");
          table.primary(["MENU_ID", "COMMENT_ID", "HISTORY_ID"]);
        })
        .run();
      draft.response.body[commentsHistory.name] = commentsHistoryResult;
    }

    if (!mysql.hasTable("commentsFiles")) {
      const commentsFilesResult = await mysql.table
        .create(commentsFiles.name, function (table) {
          table.string("MENU_ID").notNullable();
          table.string("COMMENT_ID").notNullable();
          table.string("HISTORY_ID").notNullable();
          table.string("NAME");
          table.string("HASH");
          table.integer("SIZE");
          table.string("URL");
          table.primary(["MENU_ID", "COMMENT_ID", "HISTORY_ID"]);
        })
        .run();
      draft.response.body[commentsFiles.name] = commentsFilesResult;
    }
  } catch (err) {
    console.log("create 에러", err);
    draft.json.nextNodeKey = "Output#2";
  }
};
