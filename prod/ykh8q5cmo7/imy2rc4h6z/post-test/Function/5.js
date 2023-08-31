module.exports = async (draft, { request, sql }) => {
  const { method, table } = draft.pipe.json;

  if (method !== "PATCH") {
    return;
  }

  const rowData = request.body.data;

  if (typeof rowData !== "object" || Array.isArray(rowData)) {
    sendErrRes("patch data should be single object.");
    return;
  }

  const builder = sql("mysql");
  const { UUID, ...rest } = rowData;
  const result = await builder
    .update(table, rest)
    .where({ UUID })
    .run();
  draft.response = result;

  function sendErrRes(errorMessage) {
    draft.response.statusCode = 400;
    draft.response.body = {
      errorMessage
    };
  }
};
