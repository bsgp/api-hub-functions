module.exports = async (draft, context) => {
  const { sql, makeid, lib, file } = context;
  const {
    validation,
    Data: data,
    table,
    historyInstances,
    updatingParams,
    fileInfo,
  } = draft.pipe.json;
  const { isFalsy } = lib.type;
  if (!validation) {
    return;
  }

  const builder = sql("mysql");
  // const knex = builder.knex;

  const commentsName = table.comments.name;
  const commentsFilesName = table.commentsFiles.name;
  const commentsHistoryName = table.commentsHistory.name;

  console.log("들어가는 데이터", data);
  try {
    //validate
    let E_MESSAGE = "";
    const validator = await builder.validator(commentsName);
    const result = validator(updatingParams);
    E_MESSAGE = result.E_MESSAGE;

    if (E_MESSAGE) {
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: `Error on validation : ${E_MESSAGE}`,
      };
      return;
    }
  } catch (error) {
    console.log("validation error", error);
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Error on validation`,
      error,
    };
  }

  try {
    //파일 업데이트 확인
    //원래 데이터에 파일이 있었는지 확인
    const existingFile = await builder
      .select(commentsFilesName)
      .where({ comment_id: data.comment_id, deleted: false })
      .run();

    console.log("existingFile", existingFile);
    if (existingFile.statusCode !== 200) {
      draft.response.body.E_STATUS = "F";
      draft.response.body.E_MESSAGE = `Failed Get data from CommentFile`;
      draft.response.body.result = existingFile.body;
      return;
    }

    //파일 변경사항 다루기
    let fileResult = null;
    if (data.file) {
      //파일이 추가 혹은 변경된 경우
      //파일 업로드 처리
      const path = data.file_path;
      if (!path) {
        throw new Error("file path undefined");
      }
      const { tempFilePath, fileType } = fileInfo;
      if (isFalsy(tempFilePath)) {
        return new Error("no temp file path");
      }

      const fileData = await file.get(tempFilePath, {
        exactPath: true,
        returnBuffer: true,
      });
      const fileResponse = await file.upload(path, fileData, {
        contentType: fileType,
      });
      console.log("fileResponse", fileResponse);
      if (!fileResponse) {
        return new Error("file upload error");
      }
      const updatingFile = {
        name: data.file_name,
        hash: data.file_hash,
        size: data.file_size,
        path: data.file_path,
        file_id: data.file_id,
        menu_id: data.menu_id,
        comment_id: data.comment_id,
      };

      //원래 파일 없음 -> 파일 생성
      if (existingFile.body.count === 0) {
        fileResult = await builder
          .insert(commentsFilesName, {
            ...updatingFile,
            updated_at: new Date(),
          })
          .run();
        historyInstances.push({
          menu_id: data.menu_id,
          comment_id: data.comment_id,
          history_id: makeid(6),
          name: "file",
          old_value: "",
          new_value: data.file_name,
        });
      } else {
        //원래 파일 있음 -> 파일 수정
        fileResult = await builder
          .update(commentsFilesName, updatingFile)
          .where("comment_id", data.comment_id)
          .run();
        historyInstances.push({
          menu_id: data.menu_id,
          comment_id: data.comment_id,
          history_id: makeid(6),
          name: "file",
          old_value: existingFile.body.list[0].name,
          new_value: data.file_name,
        });
      }
    } else if (!data.file_name && existingFile.body.count > 0) {
      //파일이 있었는데 새 데이터에 파일네임 안 들어옴 -> 원래 파일 삭제 처리
      fileResult = await builder
        .update(commentsFilesName, {
          file_id: "",
          name: "",
          hash: "",
          size: 0,
          path: "",
          updated_at: new Date(),
        })
        .where("comment_id", data.comment_id)
        .run();
      historyInstances.push({
        menu_id: data.menu_id,
        comment_id: data.comment_id,
        history_id: makeid(6),
        name: "file",
        old_value: existingFile.body.list[0].name,
        new_value: "",
      });
    }
    if (!!fileResult && fileResult.statusCode !== 200) {
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: `Error on updating file`,
        body: fileResult.body,
      };
      return;
    }

    //comment update
    const patchItem = {
      ...updatingParams,
      updated_at: new Date(),
    };

    console.log("updating item", patchItem);
    const query = builder
      .update(commentsName, patchItem)
      .where("comment_id", data.comment_id);

    const result = await query.run();

    console.log("result", result);
    if (result.statusCode !== 200) {
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: `statusCode is not 200 on updating`,
      };
      return;
    }
  } catch (error) {
    console.log("errr", error);
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Error on patching`,
      error,
    };
  }

  try {
    //historyInstances 돌리면서 생성
    let isFail = false;
    let failBody = null;
    await Promise.all(
      historyInstances.map(async (instance) => {
        const result = await builder
          .insert(commentsHistoryName, instance)
          .run();
        if (result.statusCode !== 200) {
          isFail = true;
          failBody = result.body;
        }
      })
    );

    if (isFail) {
      draft.response.body.E_STATUS = "F";
      draft.response.body.E_MESSAGE = "Failed creating CommentHistory";
      draft.response.body.result = failBody;
      return;
    }

    //수정이 적용된 데이터 가져오기
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
  } catch (error) {
    console.log("errrerrrrrrr", error);
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Error on history insert`,
      error,
    };
  }
};
