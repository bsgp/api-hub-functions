module.exports = async (draft, { request, dynamodb, lib }) => {
  const { clone, isTruthy, dayjs } = lib;

  draft.json.ds.rangeCondition = draft.json.rangeCondition;

  switch (draft.json.action) {
    case "MultipleBatch":
      {
        draft.json.nextNodeKey = "Loop#5";

        const dateFrom = dayjs(draft.json.ds.rangeCondition.value, "YYYYMMDD");
        const dateTo = dayjs(draft.json.ds.rangeCondition.valueTo, "YYYYMMDD");

        const diffDays = dateTo.diff(dateFrom, "day");
        draft.json.ds.expectedBatchCount = diffDays + 1;
        if (draft.json.ds.expectedBatchCount >= draft.json.ds.maxConcurrency) {
          draft.json.ds.lastRangeValue = dateFrom
            .add(draft.json.ds.maxConcurrency - 1, "day")
            .format("YYYYMMDD");
        } else {
          draft.json.ds.lastRangeValue = dateFrom
            .add(draft.json.ds.expectedBatchCount - 1, "day")
            .format("YYYYMMDD");
        }
      }

      break;
    case "SingleBatch":
      {
        draft.json.nextNodeKey = "Flow#3";

        draft.json.ds.expectedBatchCount = 1;

        draft.json.reqBody = clone(request.body);

        let batchName = "";
        if (draft.json.rangeCondition) {
          batchName = draft.json.rangeCondition.value;
        } else if (isTruthy(draft.json.reqBody.Options)) {
          batchName = draft.json.reqBody.Options.map((each) =>
            [each.value, each.valueTo].filter(Boolean).join("_")
          ).join("_");
        } else {
          batchName = [draft.json.ds.table, draft.json.ds.dataset].join("_");
        }
        draft.json.reqBody.BatchName = [draft.json.ds.version, batchName].join(
          "_"
        );
        // }
      }
      break;
    default:
      draft.response.body = {
        errorMessage: "Can not decide action",
      };
      draft.json.terminateFlow = true;

      break;
  }
  const oldItem = await dynamodb.getItem("etl_ds", {
    tb: draft.json.ds.table,
    id: draft.json.ds.dataset,
  });
  draft.json.ds = await dynamodb.updateItem(
    "etl_ds",
    {
      tb: draft.json.ds.table,
      id: draft.json.ds.dataset,
    },
    { ...draft.json.ds, lOcKkEy: oldItem && oldItem.lOcKkEy }
  );

  const bverData = await dynamodb.getItem("etl_bver", {
    tbds: [draft.json.ds.table, draft.json.ds.dataset].join("/"),
    id: draft.json.ds.version,
  });

  await dynamodb.updateItem(
    "etl_bver",
    {
      tbds: [draft.json.ds.table, draft.json.ds.dataset].join("/"),
      id: draft.json.ds.version,
    },
    { ...draft.json.ds, lOcKkEy: bverData && bverData.lOcKkEy }
  );
};
