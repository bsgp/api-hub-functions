module.exports = async (draft, { request, util, sql }) => {
  const tables = draft.pipe.json.tables;
  const params = util.upKeys(request.params);

  const keyList = {
    ID: params.ID,
    INV_ID: params.INV_ID ? `${params.INV_ID}` : undefined,
    CUSTOMER: params.CUSTOMER,
  };

  const dbName = tables.Invoice.name;
  const query = sql("mysql").select(dbName);
  let beginDate, endDate;
  if (params.DATE) {
    const dateTime = [params.DATE, "00:00:00", "+0000"].join(" ");
    const beginTimestamp = Date.parse(dateTime);
    beginDate = new Date(beginTimestamp).toISOString().replace(/\.\d{3}/, "");
    const endTimestamp = beginTimestamp + 1000 * 3600 * 24;
    endDate = new Date(endTimestamp).toISOString().replace(/\.\d{3}/, "");
  }
  if (params.FROM) {
    const dateTime = [params.FROM, "00:00:00", "+0000"].join(" ");
    const beginTimestamp = Date.parse(dateTime);
    beginDate = new Date(beginTimestamp).toISOString().replace(/\.\d{3}/, "");
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
  Object.keys(keyList).forEach((key) => {
    if (keyList[key]) {
      query.where(key, "like", `${keyList[key]}`);
    }
  });
  query.orderBy("ID", "desc").limit(2);

  try {
    const queryResult = await query.run();
    if (queryResult.statusCode === 200) {
      draft.response.body = {
        dbName,
        keyList,
        result: queryResult.body,
        E_STATUS: "S",
        E_MESSAGE: "Get data from DB successfully",
      };
      return;
    } else {
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: `Failed Get data from Invoice DB`,
        result: queryResult.body,
      };
    }
  } catch (error) {
    draft.response.body = {
      ...draft.response.body,
      error: error.message,
      E_STATUS: "F",
      E_MESSAGE: `Failed Get data from DB`,
    };
    return;
  }
};
