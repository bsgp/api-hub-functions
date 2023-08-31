module.exports = async (draft, { request, dynamodb, task }) => {
  draft.json.data = {
    ...draft.json.data,
    status: "Started",
    rowCount: 1000,
    rowSkips: 0,
    totalCount: 0,
    maxCount: 100000,
    totalDuration: 0,
    avgDuration: 0,
    minDuration: 0,
    maxDuration: 0,
    retryCount: 0,
    startedAt: new Date(),
  };

  const oldData = await dynamodb.getItem("etl_batch", {
    tbds: draft.json.data.tbds,
    id: draft.json.data.batch,
  });

  if (oldData !== undefined) {
    draft.response.body = {
      message: [
        "Batch",
        draft.json.data.batch,
        "for Table/DataSet",
        draft.json.data.tbds,
        `is ${oldData.status}`,
      ].join(" "),
      ...oldData,
    };
    return;
  }

  try {
    const newRun = await task.createV2({
      Id: draft.json.data.tbds,
      FlowId: request.flowId,
      FlowQualifier: request.qualifier,
      Payload: request.body,
      BatchId: draft.json.data.batch,
      TableId: draft.json.data.table,
      DatasetId: draft.json.data.dataset,
      RunId: request.requestTime
        .concat([draft.json.data.batch, draft.json.data.rowSkips])
        .join("/"),
    });

    draft.json.data.runId = newRun.id;
  } catch (ex) {
    draft.json.data.status = "Finished";
    draft.json.data.errorMessage = ex.message;
    await dynamodb.updateItem(
      "etl_batch",
      {
        tbds: draft.json.data.tbds,
        id: draft.json.data.batch,
      },
      draft.json.data
    );

    draft.response.body = {
      message: [
        "Batch",
        draft.json.data.batch,
        "for Table/DataSet",
        draft.json.data.tbds,
        "is",
        draft.json.data.status,
      ].join(" "),
      ...draft.json.data,
    };
    return;
  }
  // 37 line으로 인해 draft.response.body의 값이 Function#4로 넘어감
  await dynamodb.updateItem(
    "etl_batch",
    {
      tbds: draft.json.data.tbds,
      id: draft.json.data.batch,
    },
    draft.json.data
  );

  draft.response.body = {
    message: [
      "Batch",
      draft.json.data.batch,
      "for Table/DataSet",
      draft.json.data.tbds,
      "is",
      draft.json.data.status,
    ].join(" "),
    ...draft.json.data,
  };
};
