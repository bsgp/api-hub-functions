module.exports = async (draft, { dynamodb, task }) => {
  // const dataSetPath = draft.json.dataSetPath;

  // const data = await file.get(dataSetPath, {
  //   gziped: true,
  //   toJSON: true,
  //   ignoreEfs: true,
  // });
  const data = await dynamodb.getItem("etl_ds", {
    tb: draft.json.ds.table,
    id: draft.json.ds.dataset,
  });

  if (!data) {
    draft.response.body = {
      errorMessage: [
        "Dataset",
        draft.json.ds.dataset,
        "for Table",
        draft.json.ds.table,
        "does not exist",
      ].join(" "),
    };
    return;
  }

  data.batches = await dynamodb.query(
    "etl_batch",
    {
      tbds: [draft.json.ds.table, draft.json.ds.dataset].join("/"),
    },
    {
      id: ["begins_with", `${draft.json.ds.version}_`],
    }
  );

  for (let idx = 0; idx < data.batches.length; idx += 1) {
    const batch = data.batches[idx];
    if (batch.status !== "Finished") {
      const run = await task.getRun({ Id: batch.tbds, RunId: batch.runId });

      if (run.status === "failed-DuringExecution") {
        batch.status = "Finished";
        batch.errorMessage = run.responseBody.errorMessage;
        batch.errorStack = run.responseBody.errorStack;
        await dynamodb.updateItem(
          "etl_batch",
          {
            tbds: batch.tbds,
            id: batch.batch,
          },
          batch
        );
      }
    }
  }

  draft.response.body = data;
};
