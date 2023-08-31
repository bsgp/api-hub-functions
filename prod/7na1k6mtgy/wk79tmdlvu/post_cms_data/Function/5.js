module.exports = async (draft, { util, sql }) => {
  const { validation, table, reqBody, Data } = draft.pipe.json;

  if (!validation || Data.update) {
    return;
  }
  const { type } = util;
  const user = reqBody.Function.UserId;
  const data = Data.update.map((item) => util.upKeys(item));

  let E_MESSAGE = "";

  if (!type.isArray(data)) {
    E_MESSAGE = "data is not Array";
  } else if (data.length === 0) {
    E_MESSAGE = "data is empty";
  }

  const builder = sql("mysql");

  if (!E_MESSAGE) {
    const validator = await builder.validator(table);
    data.every((item) => {
      const result = validator(item);
      E_MESSAGE = result.E_MESSAGE;
      return result.isValid;
    });
  }

  if (E_MESSAGE) {
    draft.response.body = { E_MESSAGE };
    draft.response.statusCode = 400;
    return;
  }

  const query = builder.multi(table);

  data.forEach((each) => {
    const patchItem = {
      ...each,
      UPDATED_AT: new Date(),
      UPDATED_BY: user,
    };
    if (reqBody.DB === "system") {
      query.add(function () {
        this.update(patchItem).where("SYSTEM_ID", each.SYSTEM_ID);
      });
    } else
      query.add(function () {
        this.update(patchItem)
          .where("SYSTEM_ID", each.SYSTEM_ID)
          .where("ID", each.ID);
      });
  });

  const result = await query.run();

  if (result.body.code === "S") {
    const queryLOT = sql().select(table);
    if (reqBody.DB === "system") {
      queryLOT.where("SYSTEM_ID", data[0].SYSTEM_ID);
    } else {
      const IDs = data.map(({ ID }) => ID);
      queryLOT.where("ID", "IN", IDs);
    }
    const resultLOTs = await queryLOT.run();
    draft.response = resultLOTs;
  } else if (result.body.code === "F") {
    draft.response.body = {
      E_MESSAGE: "Failed update DB",
    };
    draft.response.statusCode = "500";
  } else if (result.body.code === "P") {
    const successfulList = result.body.list
      .filter(({ code }) => code === "S")
      .map((each) => data[each.index].ID);
    const query = sql().select(table).where("ID", "IN", successfulList);
    const queryResult = await query.run();
    draft.response.body.result = queryResult;
  } else {
    draft.response.body.result = result;
  }
  return;
};
