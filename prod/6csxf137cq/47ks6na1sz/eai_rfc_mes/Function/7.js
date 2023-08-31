module.exports = async (draft, { lib }) => {
  const { isArray } = lib;

  let rfcResultList = [];
  try {
    rfcResultList = draft.pipe.json.rfcResponse.body.result.T_TAB;
  } catch (ex) {
    draft.response = draft.pipe.json.rfcResponse;
    draft.json.terminateFlow = true;
    return;
  }

  if (!isArray(rfcResultList) || rfcResultList.length === 0) {
    draft.response.body = {
      errorMessage: "RFC로부터 처리할 데이터를 취득하지 못하였습니다",
    };
    draft.json.terminateFlow = true;
    return;
  }

  const { builder } = draft.pipe.ref;
  const { knex } = builder;
  const { fieldConverter, dbTable } = draft.pipe.json;

  // const result = [];
  // const length = rfcResultList.length;
  // for (let index = 0; index < length; index += 1) {
  // const each = rfcResultList[index];
  // const getDbFields = new Function("each", "knex", fieldConverter);
  // const dbFieldSet = getDbFields(each, knex);

  //   const insertQuery = builder.insert(dbTable, dbFieldSet);
  //   const insertResult = await insertQuery.run();
  //   result.push(insertResult);
  //   result.push(each);
  // }
  const perMax = 100;
  const setMax = 10;

  const length = rfcResultList.length;

  const listSet = [];
  let setIndex = 0;
  for (let index = 0; index < length; index += 1) {
    const each = rfcResultList[index];
    if (listSet[setIndex] === undefined) {
      listSet.push([each]);
    } else {
      listSet[setIndex].push(each);
    }

    if (listSet[setIndex].length === perMax) {
      setIndex += 1;
    }
    if (setIndex === setMax) {
      break;
    }
  }

  const resultList = [];

  for (let index2 = 0; index2 < listSet.length; index2 += 1) {
    const oneSet = listSet[index2];

    const multiQuery = builder.multi(dbTable);
    for (let index = 0; index < oneSet.length; index += 1) {
      const each = oneSet[index];

      const getDbFields = new Function("each", "knex", fieldConverter);
      const dbFieldSet = getDbFields(each, knex);

      // dbFieldSet.ZXSTAT = "S";
      // dbFieldSet.ZXDATS = knex.raw("CONVERT(CHAR(8),GETDATE(),112)");
      // dbFieldSet.ZXTIMS = knex.raw(
      //   "REPLACE(CONVERT(CHAR(8),GETDATE(),108),':','')"
      // );
      // dbFieldSet.ZXMSGS = "";
      // dbFieldSet.ZROWSTAT = "C";

      multiQuery.add(function () {
        this.insert(dbFieldSet).returning(
          ["ZXSTAT", "ZXDATS", "ZXTIMS", "ZXMSGS"]
          // { includeTriggerModifications: true }
        );
      });
    }
    // await multiQuery.run();
    const insertResult = await multiQuery.run();

    try {
      resultList.push(...insertResult.body.list);
    } catch (ex) {
      resultList.push(insertResult);
    }
  }

  draft.response.body = { count: resultList.length, list: resultList };
};
