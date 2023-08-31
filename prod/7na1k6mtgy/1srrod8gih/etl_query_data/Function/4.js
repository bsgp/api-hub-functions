module.exports = async (draft, { request }) => {
  if (request.body.DatasetName) {
    draft.json.nextNodeKey = "Flow#5";
  } else if (request.body.RequestType === "QUERY" && request.body.TableName) {
    draft.json.nextNodeKey = "Function#7";
  } else if (request.body.TableName) {
    draft.json.nextNodeKey = "Flow#8";
  } else if (request.body.RequestType === "CHECK") {
    draft.json.nextNodeKey = "Function#10";
    return;
  }
  if (!(request.body.TableName || request.body.DatasetName)) {
    draft.response.body = {
      errorMessage: "TableName or DatasetName is required",
    };
    draft.json.terminateFlow = true;
    return;
  }
};
