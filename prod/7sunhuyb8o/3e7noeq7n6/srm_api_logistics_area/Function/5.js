module.exports = async (draft, { request, env }) => {
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.odataService = [
    `${env.BYD_URL}`,
    "/sap/byd/odata/cust/v1/",
    "bsg_logistics_area/LogisticsAreaCollection",
  ].join("");
  draft.json.params = request.params;

  draft.json.filePath = "srm/data/srm_api_logistics_area/list.json";
  draft.json.defaultSiteID = "C1000";

  switch (request.method) {
    case "GET":
      draft.json.nextNodeKey = "Function#6";
      break;
    case "POST":
      draft.json.nextNodeKey = "Function#7";
      break;
    default:
      draft.json.nextNodeKey = "Output#2";
      break;
  }
};
