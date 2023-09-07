module.exports = async (draft, context) => {
  const { sql, makeid } = context;
  const { validation, Data: data, table } = draft.pipe.json;
  if (!validation) {
    return;
  }

  const commentsName = table.comments.name;
  const commentsFilesName = table.commentsFiles.name;
  const commentsHistoryName = table.commentsHistory.name;

  const builder = sql("mysql");

  //파일 있을 경우
  if (data.file_id) {
    const fileResult = await builder
      .update(commentsFilesName, {
        deleted: true,
      })
      .where("file_id", data.file_id)
      .run();
    if (fileResult.statusCode !== 200) {
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: `Error on deleting file`,
        body: fileResult.body,
      };
      return;
    }
  }

  //comment delete
  const commentResult = await builder
    .update(commentsName, {
      deleted: true,
      updated_at: new Date(),
    })
    .where("comment_id", data.comment_id)
    .run();
  if (commentResult.statusCode !== 200) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Error on deleting comment`,
      body: commentResult.body,
    };
    return;
  }

  //commentHistory 추가
  const newCommentHistory = {
    menu_id: data.menu_id,
    comment_id: data.comment_id,
    history_id: makeid(6),
    name: "deleted",
    new_value: true,
    old_value: false,
  };
  const historyResult = await builder
    .insert(commentsHistoryName, newCommentHistory)
    .run();
  if (historyResult.statusCode !== 200) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Error on deleting file`,
      body: historyResult.body,
    };
    return;
  }

  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: `data patch success`,
    history: newCommentHistory,
  };

  return;
};
