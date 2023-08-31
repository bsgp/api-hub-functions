module.exports = async (draft, { dynamodb, lib, fn }) => {
  const { isTruthy, dayjs } = lib;

  // const data = await dynamodb.getItem("etl_ds", {
  //   tb: draft.json.ds.table,
  //   id: draft.json.ds.dataset,
  // });

  // data.action = draft.json.action;

  draft.json.ds.rangeCondition = draft.json.rangeCondition;

  // draft.json.reqBody = clone(request.body);
  delete draft.json.reqBody.requestFrom;

  switch (draft.json.action) {
    case "MultipleBatch":
      {
        draft.json.nextNodeKey = "Loop#5";

        const rangeFormat = draft.json.reqBody.RangeFormat;
        const DATE_FORMAT = rangeFormat || "YYYYMMDD";

        const dateFrom = dayjs(draft.json.ds.rangeCondition.value, DATE_FORMAT);
        const dateTo = dayjs(draft.json.ds.rangeCondition.valueTo, DATE_FORMAT);

        const diffDays = dateTo.diff(dateFrom, fn.getDayUnit(DATE_FORMAT));
        draft.json.ds.expectedBatchCount = diffDays + 1;
        if (draft.json.ds.expectedBatchCount >= draft.json.ds.maxConcurrency) {
          draft.json.ds.lastRangeValue = dateFrom
            .add(draft.json.ds.maxConcurrency - 1, fn.getDayUnit(DATE_FORMAT))
            .format(DATE_FORMAT);
        } else {
          draft.json.ds.lastRangeValue = dateFrom
            .add(
              draft.json.ds.expectedBatchCount - 1,
              fn.getDayUnit(DATE_FORMAT)
            )
            .format(DATE_FORMAT);
        }
      }
      break;
    case "SingleBatch":
      {
        draft.json.nextNodeKey = "Flow#3";

        draft.json.ds.expectedBatchCount = 1;

        // if (!draft.json.reqBody.BatchName) {
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

  // await file.upload(dataSetPath, data, { gzip: true });

  draft.json.ds = await dynamodb.updateItem(
    "etl_ds",
    {
      tb: draft.json.ds.table,
      id: draft.json.ds.dataset,
    },
    {
      rangeCondition: draft.json.ds.rangeCondition,
      expectedBatchCount: draft.json.ds.expectedBatchCount,
      lastRangeValue: draft.json.ds.lastRangeValue,
      [dynamodb.LOCKKEY]: draft.json.ds[dynamodb.LOCKKEY],
      originQuery: draft.json.ds.originQuery,
    },
    {
      retryWhenLocked: true,
    }
  );

  await dynamodb.updateItem(
    "etl_bver",
    {
      tbds: [draft.json.ds.table, draft.json.ds.dataset].join("/"),
      id: draft.json.ds.version,
    },
    {
      rangeCondition: draft.json.ds.rangeCondition,
      expectedBatchCount: draft.json.ds.expectedBatchCount,
      lastRangeValue: draft.json.ds.lastRangeValue,
      originQuery: draft.json.ds.originQuery,
    }
  );
};
