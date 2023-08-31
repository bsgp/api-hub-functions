function calcDurations(data, lastDuration) {
  const avgDuration = Math.floor(data.totalDuration / (data.retryCount + 1));
  let minDuration = data.minDuration;
  if (minDuration === 0 || minDuration > lastDuration) {
    minDuration = lastDuration;
  }
  let maxDuration = data.maxDuration;
  if (maxDuration < lastDuration) {
    maxDuration = lastDuration;
  }

  return {
    avgDuration,
    minDuration,
    maxDuration,
  };
}

module.exports = async (draft, { request, dynamodb, task }) => {
  // draft.json.data.totalCount += draft.response.body.count;
  let lastDuration = 0;
  if (draft.json.lastStartedAt) {
    lastDuration = new Date() - new Date(draft.json.lastStartedAt);
    // draft.json.data.totalDuration += lastDuration;
  }

  draft.json.data = await dynamodb.updateItem(
    "etl_batch",
    {
      tbds: draft.json.data.tbds,
      id: draft.json.data.id,
    },
    {
      totalCount: draft.response.body.count,
      bytesSize: draft.response.body.bytesSize || 0,
      totalDuration: lastDuration,
      [dynamodb.LOCKKEY]: draft.json.data[dynamodb.LOCKKEY],
    },
    {
      operations: {
        totalCount: "+",
        totalDuration: "+",
        bytesSize: "+",
      },
      retryWhenLocked: true,
    }
  );

  if (
    draft.response.body.count < draft.json.data.rowCount ||
    draft.json.data.maxCount <= draft.json.data.totalCount
  ) {
    // draft.json.data.status = "Finished";
    draft.response.body.message = [
      "Batch",
      draft.json.data.id,
      "for Table/DataSet",
      draft.json.data.tbds,
      "is finished",
    ].join(" ");

    // draft.json.data.endedAt = new Date();
    // draft.json.data.errorMessage = draft.response.body.errorMessage;
    draft.json.data = await dynamodb.updateItem(
      "etl_batch",
      {
        tbds: draft.json.data.tbds,
        id: draft.json.data.id,
      },
      {
        ...calcDurations(draft.json.data, lastDuration),
        status: "Finished",
        endedAt: new Date(),
        errorMessage: draft.response.body.errorMessage,
        [dynamodb.LOCKKEY]: draft.json.data[dynamodb.LOCKKEY],
      },
      {
        retryWhenLocked: true,
      }
    );

    // await file.move(fileName,
    // ["archived", data.id].join("/").concat(".json"));
  } else {
    draft.json.data.retryCount += 1;
    draft.json.data.rowSkips += draft.json.data.rowCount;

    if (draft.json.data.status !== "Terminated") {
      draft.json.data.status = "WaitForNext";

      try {
        const newRun = await task.createV2({
          Id: draft.json.data.tbds,
          FlowId: request.flowId,
          FlowQualifier: request.qualifier,
          Payload: request.body,
          BatchId: draft.json.data.id,
          TableId: draft.json.data.table,
          DatasetId: draft.json.data.dataset,
          RunId: request.requestTime
            .concat([draft.json.data.id, draft.json.data.rowSkips])
            .join("/"),
        });

        draft.json.data.runId = newRun.id;
      } catch (ex) {
        draft.json.data.status = "Finished";
        draft.json.data.errorMessage = ex.message;
        // await file.upload(fileName, calcDurations(data), { gzip: true });
        await dynamodb.updateItem(
          "etl_batch",
          {
            tbds: draft.json.data.tbds,
            id: draft.json.data.id,
          },
          {
            ...draft.json.data,
            ...calcDurations(draft.json.data, lastDuration),
          }
        );

        throw ex;
      }
    }

    // await file.upload(fileName, calcDurations(data), { gzip: true });
    await dynamodb.updateItem(
      "etl_batch",
      {
        tbds: draft.json.data.tbds,
        id: draft.json.data.id,
      },
      {
        ...draft.json.data,
        ...calcDurations(draft.json.data, lastDuration),
      }
    );
  }
};
