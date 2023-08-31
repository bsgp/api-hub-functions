module.exports = async (draft, context) => {
  const { sql, lib, file } = context;
  const { validation, Data: data, table, fileInfo } = draft.pipe.json;
  const { isFalsy } = lib.type;
  if (!validation) {
    return;
  }
  let { Tables } = draft.pipe.json;
  Tables = JSON.parse(Tables);

  console.log("들어가는 데이터", data);
  const builder = sql("mysql");

  // dataObj 안에 중복값 체크
  let isValid = true;
  const validResult = [];
  try {
    Tables.map(async (table, idx) => {
      const validator = await builder.validator(table);
      const result = validator(data[idx]);
      if (!result.isValid) {
        isValid = result.isValid;
        validResult.push(result.errorMessage);
      }
    });

    if (!isValid) {
      draft.response.body.E_STATUS = "F";
      draft.response.statusCode = 400;
      draft.response.body.validResult = validResult;
      return;
    }

    const results = await Promise.all(
      data.map(async (obj, idx) => {
        // const query = builder.insert(table[Tables[idx]].name, obj);
        if (idx === 1) {
          //commentfiles 있을 경우
          const { path } = obj;
          const { tempFilePath, fileType } = fileInfo;
          if (isFalsy(tempFilePath)) {
            return new Error("no temp file path");
          }

          const fileData = await file.get(tempFilePath, {
            exactPath: true,
            returnBuffer: true,
          });

          console.log("fileType", fileType);
          const fileResponse = await file.upload(path, fileData, {
            contentType: fileType,
          });
          if (!fileResponse) {
            return new Error("file upload error");
          }
        }
        const query = builder.insert(table[Tables[idx]].name, obj);
        return await query.run();
      })
    );

    console.log("결과", results);
    results.forEach((result) => {
      if (result.statusCode === 200) {
        draft.response.body.E_STATUS = "S";
        draft.response.body.E_MESSAGE = `saved successfully`;
      } else {
        console.log("result", result);
        draft.response.body = {
          E_STATUS: "F",
          E_MESSAGE: `Failed save`,
          result: result.message,
        };
        draft.response.statusCode = 400;
        return;
      }
    });
  } catch (err) {
    console.log("errrerrrrrrr", err);
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed save`,
      result: err.message,
      error: err,
    };
  }
};
