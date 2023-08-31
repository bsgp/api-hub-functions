module.exports = async (draft, { request, util, sql }) => {
  const { table } = draft.pipe.json;
  try {
    const params = util.upKeys(request.params);
    const groupBy = params.GROUP_BY;
    const select = params.SELECT;
    const keyList = {
      BASIC_DATE: params.BASIC_DATE,
      BASIC_SEQ: params.BASIC_SEQ,
      CURR_CD: params.CURR_CD,
      BASIC_TIME: params.BASIC_TIME,
      BASIC_RATE: params.BASIC_RATE,
      CURR_NAME: params.CURR_NAME,
      SENDER: params.SENDER,
      LAST_SENDER: params.LAST_SENDER,
    };

    const query = sql("mysql").select(table);
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

    if (groupBy) {
      query.groupBy(...groupBy.split(","));
    }
    if (select) {
      query.column(...select.split(","));
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
        beginDate,
        endDate,
        result: result.body,
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
