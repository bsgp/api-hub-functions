module.exports = async (draft, { sql, user }) => {
  const routeTo = {
    exit: "Output#2",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const { tableName, orderBy } = draft.json.tableConfig;

  const { where } = draft.json.selectQuery;
  Object.keys(where).forEach((keyName) => {
    if (!where[keyName]) {
      delete where[keyName];
    }
  });
  where.DELETED = false;

  const mysql = sql("mysql");

  const builder = mysql
    .select(tableName)
    .orderBy(orderBy)
    .where("DELETED", false);
  if (where.USAGE_STATUS) {
    builder.andWhere("USAGE_STATUS", where.USAGE_STATUS);
  }
  if (where.CARD_USER_ID) {
    builder.andWhere("CARD_USER_ID", "like", `%${where.CARD_USER_ID}%`);
  }
  if (where.SET_TODAY === "yes") {
    const todayStr = dateToString();
    builder.andWhere("USAGE_DATE_FROM", "<=", todayStr);
    builder.andWhere(function () {
      this.where("USAGE_DATE_TO", ">=", todayStr).orWhereNull("USAGE_DATE_TO");
    });
    // .andWhere("USAGE_DATE_TO", ">=", todayStr);
  }
  if (where.SET_CURRENT_USER === "yes") {
    builder.andWhere("CARD_USER_ID", user.id);
  }

  const result = await builder.run();
  if (result.statusCode !== 200) {
    setFailedResponse(
      result.body.message || "Cannot find data",
      result.statusCode
    );
    return;
  }

  draft.response.body = result.body;
};

function dateToString(dateObj) {
  if (!dateObj) {
    dateObj = new Date();
  }
  const year = dateObj.getFullYear().toString();
  const month = `000${dateObj.getMonth() + 1}`.slice(-2);
  const date = `000${dateObj.getDate()}`.slice(-2);

  return [year, month, date].join("-");
}
