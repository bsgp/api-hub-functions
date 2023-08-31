module.exports = async (draft, { request, env }) => {
  // settings
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.url = [`https://${env.BYD_URL}`, "/sap/byd/odata/cust/v1"].join(
    ""
  );

  draft.json.reqPath = request.path;
  draft.json.params = request.params;
  draft.json.method = request.method;
  draft.json.resultUploadKey = request.body && request.body.resultUploadKey;
  if (draft.json.resultUploadKey) {
    draft.json.reqPath = request.body && request.body.reqPath;
  }
  draft.response.body = { ...request };
};
