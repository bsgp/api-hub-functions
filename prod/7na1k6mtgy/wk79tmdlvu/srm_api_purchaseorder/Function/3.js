module.exports = async (draft, { request, env }) => {
  // settings
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.url = [`https://${env.BYD_URL}`, "/sap/byd/odata/cust/v1"].join(
    ""
  );

  draft.json.reqPath = request.path;
  const { resultUploadKey, ...args } = request.body || {};
  draft.json.params = { ...args };
  draft.json.method = request.method;
  draft.json.resultUploadKey = resultUploadKey;
  if (draft.json.resultUploadKey) {
    draft.json.reqPath = args.endpoint;
  }
  draft.response.body = { ...request };
};
