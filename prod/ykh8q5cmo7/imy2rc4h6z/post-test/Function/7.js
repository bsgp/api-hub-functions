const uuid = require("uuid");

module.exports = async (draft, { request, sql }) => {
  const { method, table, unique } = draft.pipe.json;

  if (method !== "POST") {
    return;
  }
  
  const rowData = request.body.data;

  if (!Array.isArray(rowData)) {
    sendErrRes("post data should be array type.");
    return;
  }

  if (!rowData.length) {
    sendErrRes("post data should have one row at least.");
    return;
  }

  const uuidMappedData = rowData.map(each => ({ UUID: uuid.v4(), ...each }));

  const builder = sql("mysql");
  draft.response = await builder.insert(table, uuidMappedData).run();

  function sendErrRes(errorMessage) {
    draft.response.statusCode = 400;
    draft.response.body = {
      errorMessage
    };
  }
};
