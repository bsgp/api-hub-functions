module.exports = async (draft, { util, sql }) => {
  const { validation, table, reqBody, Data } = draft.pipe.json;

  if (!validation || !Data.create) {
    return;
  }
  const data = Data.create.map((item) => util.upKeys(item));

  if (reqBody.DB === "system") {
    const querySys = sql().select(table);
    const resultSys = await querySys.run();
    if (resultSys.body.list.length > 1) {
      draft.response.statusCode = 400;
      draft.response.body = { E_MESSAGE: `Failed save ${table}, use patch` };
      return;
    }
  }
  const user = reqBody.Function.UserId;

  // insert Log
  const dataObj = data.map((item) => {
    let obj = {
      SYSTEM_ID: item.SYSTEM_ID,
      COMPANY_ID: item.COMPANY_ID,
      CREATED_BY: user,
      UPDATED_BY: user,
    };
    if (reqBody.DB === "system") {
      obj.IMPORT = item.IMPORT;
      obj.EXPORT = item.EXPORT;
    } else {
      obj = {
        ...obj,
        ID: item.ID,
        TEXT: item.TEXT,
        IS_ACTIVATED: true,
        COUNTRY_CODE: item.COUNTRY_CODE,
      };
    }
    return obj;
  });

  const builder = sql("mysql");

  // dataObj 안에 중복값 체크 필요

  let isValid = true;
  const validResult = [];
  const validator = await builder.validator(table);
  data.every((item) => {
    const result = validator(item);
    if (!result.isValid) {
      isValid = result.isValid;
      validResult.push(result.errorMessage);
    }
    return result.isValid;
  });

  if (!isValid) {
    draft.response.statusCode = 400;
    draft.response.body.validResult = validResult;
    return;
  }

  const query = dataObj.reduce((acc, obj) => acc.insert(table, obj), builder);

  const result = await query.run();

  if (result.statusCode === 200) {
    draft.response.body.E_STATUS = "S";
    draft.response.body.E_MESSAGE = `saved successfully`;
  } else {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed save ${table}`,
      result,
    };
    draft.response.statusCode = 400;
    return;
  }
};
