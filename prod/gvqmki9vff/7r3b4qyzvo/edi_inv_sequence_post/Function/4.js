module.exports = async (draft, { sql }) => {
  const { validation, tables, reqBody } = draft.pipe.json;

  if (!validation) {
    return;
  }

  const table = tables.Invoice.name;
  const dataObj = reqBody;

  const builder = sql("mysql");

  // dataObj 안에 중복값 체크 필요

  const validator = await builder.validator(table);

  const validResult = validator(dataObj);
  if (!validResult.isValid) {
    draft.response.statusCode = 400;
    draft.response.body.validResult = validResult;
  }

  // const query=dataObj.reduce((acc, obj) => acc.insert(table, obj), builder);
  const query = builder.insert(table, [dataObj]);
  const result = await query.run();

  if (result.statusCode === 200) {
    draft.response.body.E_STATUS = "S";
    draft.response.body.E_MESSAGE = `saved successfully`;
  } else {
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "F",
      E_MESSAGE: `Failed save ${table}`,
      result,
      dataObj,
      validResult,
    };
    draft.response.statusCode = 400;
    return;
  }
};
