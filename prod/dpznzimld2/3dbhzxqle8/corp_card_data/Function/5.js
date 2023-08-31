module.exports = async (draft, { sql, user }) => {
  const routeTo = {
    exit: "Output#2",
    update: "Function#6",
  };
  // const setFailedResponse = (msg, statusCd = 400) => {
  //   draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
  //   draft.response.statusCode = statusCd;
  //   draft.json.nextNodeKey = routeTo.exit;
  // };

  const { tableName } = draft.json.tableConfig;

  const { deleted_trimmed } = draft.json.modifiedData;
  if (deleted_trimmed.length === 0) {
    draft.json.nextNodeKey = routeTo.update;
    return;
  }

  const builder = sql("mysql").update(tableName, {
    DELETED: true,
    UPDATED_AT: new Date(),
    UPDATED_BY: user.id,
  });

  deleted_trimmed.forEach((cond, index) => {
    index > 0 ? builder.orWhere(cond) : builder.where(cond);
  });

  const result = await builder.run();

  // draft.json.nextNodeKey = routeTo.exit;
  draft.json.nextNodeKey = routeTo.update;
  draft.response.body.E_MESSAGE.deleted = result;
};
