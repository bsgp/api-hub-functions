module.exports = async (draft, { env, request }) => {
  const { resultUploadKey, ...args } = request.body || {};
  draft.json.params = { ...args };
  draft.json.resultUploadKey = resultUploadKey;
  draft.response.body = {
    // request
  };
  // set env, filePath, default
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.odataService = [
    `${env.BYD_URL}`,
    "/sap/byd/odata/cust/v1/",
    "bsg_location/LocationCollection",
  ].join("");
  draft.json.filePath = "srm/data/srm_shiptolocation/data.json";
  draft.json.defaultLocationID = "C1000";
  switch (request.method) {
    case "GET":
      draft.json.nextNodeKey = "Function#4";
      break;
    case "POST":
      draft.json.nextNodeKey = "Function#5";
      break;
    default:
      draft.json.nextNodeKey = "Function#6";
      break;
  }
};
