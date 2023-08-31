module.exports = async (draft, { request, env }) => {
  // settings
  const idNpw = `${env.BYD_ID}:${env.BYD_PASSWORD}`;
  const authorization =
    "Basic " +
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64");
  const hostname = env.BYD_URL;

  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.authorization = authorization;
  draft.json.hostname = hostname;
  draft.json.odataService = [
    env.BYD_URL,
    "/sap/byd/odata/cust/v1/",
    "bsg_purchaseorder/POCollection",
  ].join("");

  draft.json.reqPath = request.path;
  draft.json.params = request.body;
  draft.json.resultUploadKey = request.body && request.body.resultUploadKey;
  draft.json.method = request.method;
  draft.response.body = { request: request.body };
};
