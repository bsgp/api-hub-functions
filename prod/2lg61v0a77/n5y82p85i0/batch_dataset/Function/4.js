module.exports = async (draft, { request }) => {
  switch (request.method) {
    case "GET":
      if (request.body.action === "Terminate") {
        draft.json.nextNodeKey = "Function#8";
      } else if (draft.json.versionId) {
        draft.json.nextNodeKey = "Function#7";
      } else if (draft.json.datasetId) {
        draft.json.nextNodeKey = "Function#6";
      } else {
        draft.json.nextNodeKey = "Function#3";
      }
      break;
    default:
      draft.response.body = {
        errorMessage: `Unsupported http method ${request.method}`,
      };
      draft.json.terminateFlow = true;
      break;
  }
};
