module.exports = async (draft, { request, env }) => {
  // settings
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.odataService = [
    `https://${env.BYD_TENANT}.sapbydesign.com`,
    "/sap/byd/odata/cust/v1/",
    "bsg_logistic_area/LocationCollection",
  ].join("");
  draft.json.params = request.params;

  draft.response.body = { ...request };
};
