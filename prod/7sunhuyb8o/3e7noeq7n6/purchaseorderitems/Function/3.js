module.exports = async (draft, { env, request }) => {
  const { resultUploadKey, ...args } = request.body || {};
  draft.json.params = { ...args };
  draft.json.resultUploadKey = resultUploadKey;
  draft.response.body = {
    // request
  };
  // set env
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.rootURL = [`${env.BYD_URL}`, "/sap/byd/odata/cust/v1"].join("");
};
