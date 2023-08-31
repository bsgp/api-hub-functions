module.exports = async (draft, { request, util, sql }) => {
  const { table } = draft.pipe.json;
  try {
    const params = util.upKeys(request.params);
    const created_at = params.DATE;

    const keyList = {
      TYPE: params.TYPE && params.TYPE.toUpperCase(),
      TASK_STEP: params.TASK_STEP && params.TASK_STEP.toUpperCase(),
      CREATED_BY: params.USER_ID,
      UNIQUE_KEY: params.UNIQUE_KEY,
      PRODUCTION_ORDER_ID: params.PRODUCTION_ORDER_ID,
      CONFIRMATION_ID: params.CONFIRMATION_ID,
      RES_STATUS: params.RES_STATUS,
    };

    const query = sql("mysql").select(table);
    if (created_at) {
      const dmDateTime = [created_at, "00:00:00", "-0400"].join(" ");
      const beginTimestamp = Date.parse(dmDateTime);
      const beginDate = new Date(beginTimestamp)
        .toISOString()
        .replace(/\.\d{3}/, "");
      const endTimestamp = beginTimestamp + 1000 * 3600 * 24;
      const endDate = new Date(endTimestamp)
        .toISOString()
        .replace(/\.\d{3}/, "");
      query
        .where("CREATED_AT", ">=", beginDate)
        .where("CREATED_AT", "<", endDate);
    }
    Object.keys(keyList).forEach((key) => {
      if (keyList[key]) {
        query.where(key, "like", keyList[key]);
      }
    });

    query.orderBy("CREATED_AT", "desc");

    const result = await query.run();
    if (result.statusCode === 200) {
      draft.response.body = {
        E_STATUS: "S",
        E_MESSAGE: `Get data from log DB`,
        result: result.body,
        table,
      };
    } else {
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: `Failed Get data from log DB`,
        result: result.body,
        table,
      };
    }
  } catch (error) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed Get data`,
      error,
    };
  }
};
