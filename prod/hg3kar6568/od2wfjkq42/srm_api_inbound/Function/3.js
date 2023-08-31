module.exports = async (draft, { request, env }) => {
  // settings
  draft.json.params = request.params;
  draft.json.odataURL = `https://${env.BYD_URL}/sap/byd/odata/cust/v1/`;

  draft.json.params = request.params;
  draft.json.method = request.method;
  draft.json.resultUploadKey = request.body && request.body.resultUploadKey;
  draft.json.reqPath = request.body && request.body.reqPath;

  draft.response.body = { request };
};
