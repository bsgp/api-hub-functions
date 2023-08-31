function updateData(data, lastDuration) {
  data.avgDuration = Math.floor(data.totalDuration / (data.retryCount + 1));
  if (data.minDuration === 0 || data.minDuration > lastDuration) {
    data.minDuration = lastDuration;
  }
  if (data.maxDuration < lastDuration) {
    data.maxDuration = lastDuration;
  }

  return data;
}

module.exports = async (draft, { request, dynamodb, task /*,lib*/ }) => {
  // const { wait } = lib;
  draft.json.data.totalCount += draft.response.body.count; //legacy
  console.log(
    "draft.response.body.count :",
    draft.response.body.count,
    "totalCount: ",
    draft.json.data.totalCount,
    "log in function5"
  );
  /*
  해당 로직이 들어간다고 해도 근본적인 문제가 해결되지 않음
   => 현재 Function#10에서 expectedBatchCount와 finishedBatchCount를 
      비교하여 etl_ds의 status에 상태를 변경하고 있음
   
   => 이슈
       로직 상 finishedBatchCount는 데이터 이관이 완료된 
       배치의 상태가 Finished 일 경우 + 1
       하지만 현재 배치는 모든 테스크를 완료했지만, 
       finishedBatchCount는 expectedBatchCount 보다 그 수가 적음
       
  // 20221011 아이템 비교
  const maxRetry = 5;
  let curRetry = 0;
  while (curRetry < maxRetry) {
    const oldItem = await dynamodb.getItem("etl_batch", {
      tbds: draft.json.data.tbds,
      id: draft.json.data.batch,
    });

    console.log(JSON.stringify(draft.json.data), "oldItem in function5");
    try {
      const updateItem = await dynamodb.updateItem(
        "etl_batch",
        { tbds: draft.json.data.tbds, id: draft.json.data.batch },
        {
          totalCount: draft.response.body.count,
          // ...oldItem,
          lOcKkEy: oldItem && oldItem.lOcKkEy,
        },
        { operations: { totalCount: "+" } }
      );
      console.log(JSON.stringify(updateItem), "updateItem in function5");
      break;
    } catch (ex) {
      // continue
    }
    curRetry += 1;
    await wait(1);
  }
*/
  if (draft.json.lastStartedAt) {
    draft.json.lastDuration = new Date() - new Date(draft.json.lastStartedAt);
    draft.json.data.totalDuration += draft.json.lastDuration;
  }

  if (
    draft.response.body.count < draft.json.data.rowCount ||
    draft.json.data.maxCount <= draft.json.data.totalCount // legacy
  ) {
    draft.json.data.status = "Finished";
    // draft.json.data.isUpdated = true;
    draft.response.body.message = [
      "Batch",
      draft.json.data.batch,
      "for Table/DataSet",
      draft.json.data.tbds,
      "is finished",
    ].join(" ");

    draft.json.data.endedAt = new Date();
    draft.json.data.errorMessage = draft.response.body.errorMessage;

    await dynamodb.updateItem(
      "etl_batch",
      {
        tbds: draft.json.data.tbds,
        id: draft.json.data.batch,
      },
      updateData(draft.json.data, draft.json.lastDuration)
    );
  } else {
    draft.json.data.status = "WaitForNext";

    draft.json.data.retryCount += 1;
    draft.json.data.rowSkips += draft.json.data.rowCount;

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
        updateData(draft.json.data, draft.json.lastDuration)
      );

      throw ex;
    }

    await dynamodb.updateItem(
      "etl_batch",
      {
        tbds: draft.json.data.tbds,
        id: draft.json.data.batch,
      },
      updateData(draft.json.data, draft.json.lastDuration)
    );
  }
};
