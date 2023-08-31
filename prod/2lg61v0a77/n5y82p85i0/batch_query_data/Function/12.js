module.exports = async (draft, { dynamodb }) => {
  // if (request.body.InParallel === true) {
  // const groupId = draft.json.groupId;
  // const data = await dynamodb.getItem("etl_batch", {
  //   tbds: groupId,
  //   id: request.body.BatchName,
  // });

  if (["Finished", "Terminated"].includes(draft.json.data.status)) {
    if (draft.json.data.errorMessage) {
      draft.json.nextNodeKey = "Output#2";
      return;
    }

    draft.json.nextNodeKey = "Flow#11";

    let newDsData = await dynamodb.getItem("etl_ds", {
      tb: draft.json.data.table,
      id: draft.json.data.dataset,
    });

    // dsData.finishedBatchCount += 1;

    // if (dsData.rowsCount === undefined) {
    //   dsData.rowsCount = 0;
    // }
    // dsData.rowsCount += draft.json.data.totalCount;

    const updateParams = [
      {
        [dynamodb.LOCKKEY]: newDsData[dynamodb.LOCKKEY],
        finishedBatchCount: 1,
        rowsCount: draft.json.data.totalCount,
        bytesSize: draft.json.data.bytesSize,
      },
      {
        operations: {
          finishedBatchCount: "+",
          rowsCount: "+",
          bytesSize: "+",
        },
        retryWhenLocked: true,
      },
    ];
    newDsData = await dynamodb.updateItem(
      "etl_ds",
      {
        tb: draft.json.data.table,
        id: draft.json.data.dataset,
      },
      ...updateParams
    );

    delete updateParams[1].retryWhenLocked;
    delete updateParams[0][dynamodb.LOCKKEY];

    await dynamodb.updateItem(
      "etl_bver",
      {
        tbds: [draft.json.data.table, draft.json.data.dataset].join("/"),
        id: newDsData.version,
      },
      ...updateParams
    );

    if (newDsData.finishedBatchCount >= newDsData.expectedBatchCount) {
      // dsData.endedAt = new Date();
      // dsData.status = "Finished";
      const data = {
        endedAt: new Date(),
        status: "Finished",
      };

      await dynamodb.updateItem(
        "etl_ds",
        {
          tb: draft.json.data.table,
          id: draft.json.data.dataset,
        },
        {
          ...data,
          [dynamodb.LOCKKEY]: newDsData[dynamodb.LOCKKEY],
        },
        {
          retryWhenLocked: true,
        }
      );
      await dynamodb.updateItem(
        "etl_bver",
        {
          tbds: [draft.json.data.table, draft.json.data.dataset].join("/"),
          id: newDsData.version,
        },
        {
          ...data,
          finishedBatchCount: newDsData.finishedBatchCount,
          rowsCount: newDsData.rowsCount,
          bytesSize: newDsData.bytesSize,
        }
      );

      draft.json.nextNodeKey = "Output#2";
    } else {
      if (newDsData.status === "Terminated") {
        draft.json.nextNodeKey = "Output#2";
      }
    }

    //else{
    // dsData.batches[draft.json.data.id] = draft.response.body;
    //}
  } else {
    draft.json.nextNodeKey = "Output#2";
  }
  // } else {
  //   draft.json.nextNodeKey = "Output#2";
  // }
};
