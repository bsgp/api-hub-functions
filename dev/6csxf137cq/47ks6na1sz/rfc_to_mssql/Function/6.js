module.exports = async (draft, { lib }) => {
  const { isArray } = lib;

  const rfcResultList = draft.pipe.json.rfcResponse.body.result.T_TAB;

  if (!isArray(rfcResultList)) {
    draft.response.body = {
      errorMessage: "RFC로부터 처리할 데이터를 취득하지 못하였습니다",
    };
    draft.json.terminateFlow = true;
    return;
  }

  const { builder } = draft.pipe.ref;
  const { knex } = builder;
  const { fieldConverter, dbTable } = draft.pipe.json;

  const result = [];
  // const length = rfcResultList.length;
  for (let index = 0; index < 1; index += 1) {
    const each = rfcResultList[index];
    const getDbFields = new Function("each", "knex", fieldConverter);
    const dbFieldSet = getDbFields(each, knex);

    const insertQuery = builder.insert(dbTable, dbFieldSet);
    const insertResult = await insertQuery.run();
    result.push(insertResult);
    result.push(each);
  }

  draft.response.body = result;
};
