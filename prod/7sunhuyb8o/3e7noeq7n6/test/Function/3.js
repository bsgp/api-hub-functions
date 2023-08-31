module.exports = async (draft, { file, request, util, sql }) => {
  const tableConfig = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });
  const table = tableConfig.confirmationjournal.name;
  try {
    const params = util.upKeys(request.body);
    const created_at = params.DATE;
    const keyList = {
      CBT_POSTING_DATE: params.CBT_POSTING_DATE,
      CISTOCK_UUID: params.CISTOCK_UUID,
      // TYPE: params.TYPE && params.TYPE.toUpperCase(),
      // TASK_STEP: params.TASK_STEP && params.TASK_STEP.toUpperCase(),
    };

    const query = sql("mysql").select(table);
    if (created_at) {
      const DateTime = [created_at, "00:00:00"].join(" ");
      const beginTimestamp = Date.parse(DateTime);
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

    const result = await query.run();
    if (result.statusCode === 200) {
      draft.response.body = {
        E_STATUS: "S",
        E_MESSAGE: `Get data from log DB`,
        result: result.body,
        request: params,
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
  } catch (err) {
    draft.response.body = {
      error: err.message,
    };
  }
};
