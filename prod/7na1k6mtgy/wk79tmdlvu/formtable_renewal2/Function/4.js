module.exports = async (draft, { request, sql }) => {
  console.log(draft, request);

  const { tableName } = request.body;
  const query = sql("mysql").select(tableName);
  const dataFromTable = await query.run();

  const resBody = {
    E_STATUS: "S",
    E_MSG: "GET DATA IS DONE",
    E_BODY: dataFromTable,
  };

  draft.response.body = resBody;
};
