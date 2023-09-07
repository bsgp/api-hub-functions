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

  //삭제가 적용된 데이터 가져오기
  const queryLOT = builder
    .select(commentsName, [
      `${commentsHistoryName}.*`,
      `${commentsFilesName}.*`,
      `${commentsName}.*`,
      `${commentsHistoryName}.created_at AS history_created_at`,
      `${commentsHistoryName}.name AS history_name`,
    ])
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
    )
    .where({
      [`${commentsName}.comment_id`]: data.comment_id,
    })
    .orderBy([{ column: "history_created_at", order: "desc" }]);

  console.log("sql", queryLOT.toSQL().sql);
  console.log("bindings", queryLOT.toSQL().bindings);
  const resultLOT = await queryLOT.run();
  console.log("select result list", resultLOT.body.list);
  // const histories = await builder
  //   .select(commentsHistoryName)
  //   .where("comment_id", data.comment_id)
  //   .run();
  // console.log("생성된 히스토리들", histories.body.list);

  // 데이터 하나로 묶는 작업
  const newComment = resultLOT.body.list.reduce((acc, data) => {
    if (!data.history_id) {
      return acc;
    }
    const historyData = {
      history_id: data.history_id,
      history_name: data.history_name,
      new_value: data.new_value,
      old_value: data.old_value,
      history_created_at: data.history_created_at,
    };
    if (!acc.history_id) {
      return {
        ...data,
        history: [historyData],
      };
    } else {
      return {
        ...acc,
        history: acc.history.concat(historyData),
      };
    }
  }, {});

  console.log("final result", newComment);
  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: `data patch success`,
    result: newComment,
  };

  return;
};
