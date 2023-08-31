module.exports = async (draft, { request, util, sql }) => {
  const tables = draft.pipe.json.tables;

  const params = util.upKeys(request.params);
  const dbType = params.DB_TYPE;
  const poList = params.PO_LIST;
  const groupBy = params.GROUP_BY;
  const select = params.SELECT;
  const requestDB = dbType ? [dbType] : ["IDN_HEADER", "IDN_ITEMS"];

  const keyList = {
    IDN_ID: params.IDN_ID,
    CREATED_BY: params.CREATED_BY,
    PO_NUMBER: params.PO_NUMBER,
    VENDOR: params.VENDOR,
  };

  let result = true;

  await Promise.all(
    requestDB.map(async (dbKey) => {
      const dbName = tables[dbKey].name;
      const query = sql("mysql").select(dbName);
      let beginDate, endDate;
      if (params.DATE) {
        const dateTime = [params.DATE, "00:00:00", "+0000"].join(" ");
        const beginTimestamp = Date.parse(dateTime);
        beginDate = new Date(beginTimestamp)
          .toISOString()
          .replace(/\.\d{3}/, "");
        const endTimestamp = beginTimestamp + 1000 * 3600 * 24;
        endDate = new Date(endTimestamp).toISOString().replace(/\.\d{3}/, "");
      }
      if (params.FROM) {
        const dateTime = [params.FROM, "00:00:00", "+0000"].join(" ");
        const beginTimestamp = Date.parse(dateTime);
        beginDate = new Date(beginTimestamp)
          .toISOString()
          .replace(/\.\d{3}/, "");
      }
      if (params.TO) {
        const dateTime = [params.TO, "00:00:00", "+0000"].join(" ");
        const endTimestamp = Date.parse(dateTime) + 1000 * 3600 * 24;
        endDate = new Date(endTimestamp).toISOString().replace(/\.\d{3}/, "");
      }
      if (beginDate) {
        query.where("CREATED_AT", ">=", beginDate);
      }
      if (endDate) {
        query.where("CREATED_AT", "<", endDate);
      }
      if (params.PO_LIST) {
        query.where("PO_NUMBER", "in", `${poList}`.split(","));
      }
      if (groupBy) {
        query.groupBy(...groupBy.split(","));
      }
      if (select) {
        query.column(...select.split(","));
      }
      Object.keys(keyList).forEach((key) => {
        if (keyList[key]) {
          query.where(key, "like", `${keyList[key]}`);
        }
      });
      query.orderBy("CREATED_AT", "desc");

      const queryResult = await query.run();
      if (queryResult.statusCode === 200) {
        draft.response.body[dbKey] = {
          E_STATUS: "S",
          result: queryResult.body,
        };
        return;
      } else {
        result = false;
        draft.response.body[dbKey] = {
          E_STATUS: "F",
          E_MESSAGE: `Failed Get data from ${dbKey} DB`,
          result: queryResult.body,
        };
        return;
      }
    })
  ).catch((error) => {
    draft.response.body = { error };
    result = false;
    return;
  });

  if (!result) {
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "F",
      E_MESSAGE: "납품서를 가져오는 과정에서 문제가 발생했습니다.",
    };
  } else {
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "S",
      E_MESSAGE: "조회가 완료되었습니다.",
    };
  }
};
