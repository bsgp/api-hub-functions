module.exports = async (draft, { request, isArray, isNumber }) => {
  const { builder } = draft.ref;
  if (request.body.Test) {
    const query = builder.select(draft.json.ifObj.Name);
    query.limit(10);

    const result = await query.run();

    draft.json.dbResult = result.body;
    draft.response = result;
  } else {
    if (!isArray(draft.response.body.ET_DATA)) {
      draft.json.terminateFlow = true;
      return;
    }

    const totalCount = draft.response.body.ET_DATA.length;

    const data_1000_Parts = draft.response.body.ET_DATA.reduce(
      (acc, each) => {
        const groupIndex = acc.length - 1;
        acc[groupIndex].push(each);

        if (acc[groupIndex].length === 1000) {
          acc.push([]);
        }
        return acc;
      },
      [[]]
    );

    draft.response.body = {
      E_COUNT: 0,
      E_TOTAL: totalCount,
    };

    for (
      let groupIndex = 0;
      data_1000_Parts.length > groupIndex;
      groupIndex += 1
    ) {
      const oneGroupList = data_1000_Parts[groupIndex];

      const query = builder.insert(
        draft.json.ifObj.Name,
        oneGroupList.map((each) => ({
          ...each,
          ETLDATE: builder.knex.raw("GETDATE()"),
        }))
      );

      const result = await query.run();

      draft.json[`dbResult_${groupIndex}`] = result.body;

      if (isNumber(result.body.count)) {
        draft.response.body.E_COUNT += result.body.count;
        draft.response.body.E_STATUS = "S";
        draft.response.body.E_MESSAGE = result.body.message;
      } else {
        draft.response.body.E_STATUS = "F";
        draft.response.body.E_MESSAGE = JSON.stringify(result.body);
        break;
      }
    }
  }
};
