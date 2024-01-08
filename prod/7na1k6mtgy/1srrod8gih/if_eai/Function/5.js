module.exports = async (draft, { request, dynamodb, fn }) => {
  const tableName = "eai_dev";

  switch (request.method) {
    case "GET":
      {
        const result = await fn.getAllConfigs({ dynamodb, tableName });
        draft.response.body = result;
      }
      break;
    case "POST":
      {
        const result = await fn.saveConfig(request.body, {
          dynamodb,
          tableName,
        });
        draft.response.body = result;
      }
      break;
    case "PUT":
      break;
    default:
    // code
  }
};
