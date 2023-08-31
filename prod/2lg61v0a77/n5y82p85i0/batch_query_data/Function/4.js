module.exports = async (draft, { request }) => {
  // draft.json.groupId = [request.body.TableName, request.body.DataSetName]
  //   .join("/")
  //   .toLowerCase();
  // draft.json.fileName = [draft.json.groupId, request.body.BatchName]
  //   .join("/")
  //   .concat(".json")
  //   .toLowerCase();
  draft.json.data = {
    table: request.body.TableName.toLowerCase(),
    dataset: request.body.DataSetName.toLowerCase(),
    id: request.body.BatchName.toLowerCase(),
  };
  draft.json.data.tbds = [draft.json.data.table, draft.json.data.dataset].join(
    "/"
  );

  draft.json.countPerTime = 1000;

  switch (request.method) {
    case "DELETE":
      draft.json.nextNodeKey = "Function#8";
      break;
    case "GET":
      draft.json.nextNodeKey = "Function#7";
      break;
    case "POST":
      draft.json.nextNodeKey = "Function#9";
      break;
    case "TASK":
      draft.json.nextNodeKey = "Function#10";
      break;
    default:
      draft.response.body = {
        errorMessage: `Unsupported Method:${request.method}`,
      };
      draft.json.terminateFlow = true;
      break;
  }
};
