module.exports = async (draft, { request, dynamodb, task }) => {
  // const fileName = draft.json.fileName;
  // const groupId = draft.json.groupId;

  const data = await dynamodb.getItem("etl_batch", {
    tbds: draft.json.data.tbds,
    id: draft.json.data.batch,
  });
  // const data = await tryit(() =>
  //   file.get(fileName, {
  //     gziped: true,
  //     toJSON: true,
  //     ignoreEfs: true,
  //   })
  // );
  if (data === undefined) {
    draft.response.body = {
      message: [
        "Batch",
        request.body.BatchName,
        "for Table/DataSet",
        draft.json.data.tbds,
        "does not exist",
      ].join(" "),
    };
    return;
  }

  const run = await task.getRun({ Id: data.tbds, RunId: data.runId });

  if (run.status === "failed-DuringExecution" && data.status !== "Finished") {
    data.status = "Finished";
    data.errorMessage = run.responseBody.errorMessage;
    data.errorStack = run.responseBody.errorStack;
    await dynamodb.updateItem(
      "etl_batch",
      {
        tbds: draft.json.data.tbds,
        id: draft.json.data.batch,
      },
      data
    );
  }

  draft.response.body = {
    message: `Querying from ${data.rowSkips + 1} to ${
      data.rowSkips + data.rowCount
    } records`,
    ...data,
    lastRun: run,
  };
};
