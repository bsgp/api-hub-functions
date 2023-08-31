module.exports = async (draft, { request }) => {
  draft.json.dbName =
    request.partnerId === "2lg61v0a77"
      ? ["ecc_dev_datalake", request.stage].join("_")
      : ["etl_db", request.stage].join("_");

  switch (request.method) {
    case "GET":
      if (request.body.Database) {
        draft.json.nextNodeKey = "Function#7";
      } else {
        draft.json.nextNodeKey = "Function#3";
      }
      break;
    case "POST":
      if (request.body.Database) {
        draft.json.nextNodeKey = "Function#8";
      } else {
        draft.json.nextNodeKey = "Flow#5";
      }
      break;
    default:
      throw new Error(`Unsupported http method ${request.method}`);
  }
};
