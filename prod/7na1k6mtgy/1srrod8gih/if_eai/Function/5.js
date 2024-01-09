module.exports = async (draft, { request, dynamodb, zip, unzip, fn }) => {
  //tableName stage와 맞게 변경 필요
  const tableName = "eai_dev";

  switch (request.method) {
    case "GET":
      {
        const { id } = request.body;
        if (id === "*") {
          const result = await fn.getAllConfigs({ dynamodb, tableName, unzip });
          draft.response.body = result;
        } else {
          const result = await fn.getConfig(id, { dynamodb, tableName, unzip });
          draft.response.body = result;
        }
      }
      break;
    case "POST":
      {
        const result = await fn.saveConfig(request.body, {
          dynamodb,
          tableName,
          zip,
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
