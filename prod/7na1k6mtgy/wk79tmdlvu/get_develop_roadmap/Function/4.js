module.exports = async (draft, { request, sql }) => {
  // your script
  try {
    if (draft.response.body && draft.response.body.E_STATUS === "N") {
      return;
    }
    const tables = draft.pipe.json.tables;

    const commentsName = tables.comments.name;
    const commentsFilesName = tables.commentsFiles.name;
    const commentsHistoryName = tables.commentsHistory.name;

    const { menu } = request.params;
    if (!menu) {
      console.log("메뉴id 들어오지 않음");
      draft.response.body.E_STATUS = "F";
      draft.response.body.E_MESSAGE = `메뉴id 들어오지 않음`;
      return;
    }
    console.log("메뉴 들어옴", menu);
    const builder = sql("mysql");
    // const knex = builder.knex;

    const query = builder
      .select(commentsName, [
        `${commentsHistoryName}.*`,
        `${commentsFilesName}.*`,
        `${commentsName}.*`,
        `${commentsHistoryName}.created_at AS history_created_at`,
        `${commentsFilesName}.created_at AS file_created_at`,
        `${commentsHistoryName}.name AS history_name`,
      ])
      .where({
        //      [`${commentsName}.deleted`]: false,
        [`${commentsName}.menu_id`]: menu,
      })
      .leftJoin(
        commentsFilesName,
        `${commentsName}.comment_id`,
        "=",
        `${commentsFilesName}.comment_id`
      )
      .leftJoin(
        commentsHistoryName,
        `${commentsName}.comment_id`,
        "=",
        `${commentsHistoryName}.comment_id`
      );

    query.orderBy([
      { column: `${commentsName}.created_at`, order: "desc" },
      { column: "history_created_at", order: "desc" },
    ]);

    console.log("sql", query.toSQL().sql);
    console.log("bindings", query.toSQL().bindings);
    const queryResult = await query.run();
    if (queryResult.statusCode !== 200) {
      console.log("에러", queryResult.body);
      draft.response.body.E_STATUS = "F";
      draft.response.body.E_MESSAGE = `Failed Get data from DB`;
      draft.response.body.result = queryResult.body;
      return;
    }

    //현재 comment+history 둘 중 하나만 달라도 별개의 레코드로 되어 있는
    // 데이터를 comment가 같은 경우 하나로 묶는 작업..
    const commentIndexChecker = {};
    const newCommentArray = [];
    queryResult.body.list.forEach((data) => {
      const { history_id, comment_id } = data;
      if (!history_id) {
        const length = newCommentArray.length;
        newCommentArray.push(data);
        commentIndexChecker[comment_id] = length;
      } else {
        const historyData = {
          history_id: data.history_id,
          history_name: data.history_name,
          new_value: data.new_value,
          old_value: data.old_value,
          history_created_at: data.history_created_at,
        };
        if (comment_id in commentIndexChecker) {
          const idx = commentIndexChecker[comment_id];
          newCommentArray[idx].history.push(historyData);
        } else {
          const length = newCommentArray.length;
          newCommentArray.push({
            ...data,
            history: [historyData],
          });
          commentIndexChecker[comment_id] = length;
        }
      }
    });

    console.log("리스트", newCommentArray);

    draft.response.body.E_STATUS = "S";
    draft.response.body.E_MESSAGE = "Get data from DB successfully";
    draft.response.body.list = newCommentArray;
    draft.response.body.count = newCommentArray.length;
  } catch (error) {
    console.log("에러", error);
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed Get data`,
      error,
    };
  }
};
