module.exports = async (draft, { request, env }) => {
  // settings
  draft.json.params = request.params;

  const searchType = request.params.searchType;
  draft.json.searchType = searchType;
  //searchType: "header" | "items" | "detail"

  draft.json.odataService = [
    `https://${env.BYD_TENANT}.sapbydesign.com`,
    "/sap/byd/odata/cust/v1/",
    "bsg_inbound_notify",
  ].join("");

  draft.json.method = request.method;
  draft.response.body = { ...request };
};
