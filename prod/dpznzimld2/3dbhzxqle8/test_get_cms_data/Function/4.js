module.exports = async (draft, { sql }) => {
  const routeTo = {
    exit: "Output#2",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const { tableName } = draft.json.queryData;
  const mysql = sql("mysql");

  const result = await mysql.select(tableName).run();
  if (result.statusCode !== 200) {
    setFailedResponse(
      result.body.message || "Table is not found",
      result.statusCode
    );
    return;
  }

  draft.response.body = { ...result.body };
};
