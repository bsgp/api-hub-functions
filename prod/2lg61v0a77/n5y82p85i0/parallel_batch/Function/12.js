module.exports = async (draft, { request, dynamodb, lib }) => {
  const { clone } = lib;

  // Only one Dataset can run at same time.
  draft.json.ds = {
    table: request.body.TableName.toLowerCase(),
    dataset: request.body.DataSetName.toLowerCase(),
    version: "1",
    // currentBatchCount: 0,
    rowsCount: 0,
    bytesSize: 0,
    finishedBatchCount: 0,
  };

  let newMethod = request.method;
  if (request.body.requestFrom === "Scheduler") {
    newMethod = "POST";
  }

  switch (newMethod) {
    case "GET":
      draft.json.nextNodeKey = "Function#13";
      draft.json.ds.version = request.body.Version.toLowerCase();
      break;
    case "TASK":
      draft.json.nextNodeKey = "Function#14";

      draft.json.ds = await dynamodb.getItem("etl_ds", {
        tb: draft.json.ds.table,
        id: draft.json.ds.dataset,
      });
      break;
    case "POST": {
      draft.json.nextNodeKey = "Flow#16";

      const oldData = await dynamodb.getItem("etl_ds", {
        tb: draft.json.ds.table,
        id: draft.json.ds.dataset,
      });
      if (oldData) {
        if (["Finished", "Terminated"].includes(oldData.status) === false) {
          draft.response.body = {
            errorMessage: [
              "Dataset",
              draft.json.ds.dataset,
              "for table",
              draft.json.ds.table,
              "is",
              oldData.status,
            ].join(" "),
          };
          draft.json.terminateFlow = true;
          return;
        }
        if (oldData.version) {
          draft.json.ds.version = Number(oldData.version) + 1;
          draft.json.ds.version = draft.json.ds.version.toString();
        }
      }

      draft.json.ds.startedAt = new Date();
      draft.json.ds.endedAt = "";
      draft.json.ds.status = "Started";
      draft.json.ds.maxConcurrency = 5;

      draft.json.ds.originQuery = {
        WithoutRangeField: request.body.WithoutRangeField,
        RangeField: request.body.RangeField,
        Options: clone(request.body.Options),
        Columns: clone(request.body.Columns),
      };

      draft.json.ds = await dynamodb.updateItem(
        "etl_ds",
        {
          tb: draft.json.ds.table,
          id: draft.json.ds.dataset,
        },
        draft.json.ds
      );
      draft.json.bver = await dynamodb.updateItem(
        "etl_bver",
        {
          tbds: [draft.json.ds.table, draft.json.ds.dataset].join("/"),
          id: draft.json.ds.version,
        },
        draft.json.ds
      );

      break;
    }
    default:
      draft.response.body = {
        errorMessage: `Unsupported http method ${request.method}`,
      };
      draft.json.terminateFlow = true;
      break;
  }
};
