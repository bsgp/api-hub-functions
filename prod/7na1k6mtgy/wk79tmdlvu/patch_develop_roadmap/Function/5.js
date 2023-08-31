module.exports = async (draft, { sql, makeid }) => {
  try {
    const { Data, table } = draft.pipe.json;
    const { comment_id, menu_id } = Data;

    if (!comment_id || !menu_id) {
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: `comment_id 없음`,
      };
    }

    // 기존 comment 가져오기
    const commentsName = table.comments.name;
    const query = sql("mysql")
      .select(commentsName)
      .where("comment_id", comment_id);

    const queryResult = await query.run();
    console.log("qr", queryResult);
    if (queryResult.statusCode !== 200) {
      draft.response.body.E_STATUS = "F";
      draft.response.body.E_MESSAGE = `Failed Get data from DB`;
      draft.response.body.result = queryResult.body;
      draft.pipe.json.validation = false;
      return;
    }
    if (queryResult.body.count === 0) {
      draft.response.body.E_STATUS = "F";
      draft.response.body.E_MESSAGE = `DB에 해당 데이터 존재하지 않음`;
      draft.response.body.result = queryResult.body;
      return;
    }

    console.log("기존 커멘트 select 쿼리 결과", queryResult);
    const existingComment = queryResult.body.list[0];

    //기존 커멘트와 현재 body로 들어온 값 비교하면서 히스토리 변경 생성
    // + comment update문에 들어갈 데이터 생성
    const updatingParams = {};
    const historyInstances = Object.entries(existingComment).reduce(
      (acc, [key, value]) => {
        //변경된 데이터 적용
        // + 변경되면 안 되는 데이터(deleted, created_at 등)는 수정되지 않도록 제외
        if (
          Data[key] !== value &&
          key !== "deleted" &&
          key !== "created_at" &&
          key !== "updated_at"
        ) {
          const history_id = makeid(6);
          updatingParams[key] = Data[key];
          return [
            ...acc,
            {
              menu_id,
              comment_id,
              history_id,
              name: key,
              old_value: value,
              new_value: Data[key],
            },
          ];
        } else {
          return acc;
        }
      },
      []
    );

    console.log("만들 히스토리들", historyInstances);

    //history instance 전달(수정 이후에 create)
    draft.pipe.json.historyInstances = historyInstances;
    //updatingParams 전달(update문 인자로 들어감)
    draft.pipe.json.updatingParams = updatingParams;
  } catch (err) {
    console.log("에러", err);
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed in creating comment history`,
      err,
    };
  }
};
