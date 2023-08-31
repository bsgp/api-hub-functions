module.exports = async (draft, { dynamodb }) => {
  console.log("totalCount: ", draft.json.data.totalCount, "log in function12");
  const startPoint = await dynamodb.getItem("etl_ds", {
    tb: draft.json.data.table,
    id: draft.json.data.dataset,
  });
  console.log("start Point:", startPoint);

  if (draft.json.data.status === "Finished") {
    if (draft.json.data.errorMessage) {
      console.log(
        JSON.stringify(draft.json.data),
        "draft.json.data in function12"
      );
      draft.json.nextNodeKey = "Output#2";
      return;
    }

    draft.json.nextNodeKey = "Flow#11";

    const dsData = await dynamodb.getItem("etl_ds", {
      tb: draft.json.data.table,
      id: draft.json.data.dataset,
    });

    const updateParams = [
      {
        finishedBatchCount: 1,
        rowsCount: draft.json.data.totalCount,
      },
      {
        operations: {
          finishedBatchCount: "+",
          rowsCount: "+",
        },
      },
    ];

    const newDsData = await dynamodb.updateItem(
      "etl_ds",
      {
        tb: draft.json.data.table,
        id: draft.json.data.dataset,
      },
      ...updateParams
    );

    await dynamodb.updateItem(
      "etl_bver",
      {
        tbds: [draft.json.data.table, draft.json.data.dataset].join("/"),
        id: dsData.version,
      },
      ...updateParams
    );

    if (newDsData.finishedBatchCount >= dsData.expectedBatchCount) {
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
        data
      );
      await dynamodb.updateItem(
        "etl_bver",
        {
          tbds: [draft.json.data.table, draft.json.data.dataset].join("/"),
          id: dsData.version,
        },
        data
      );
      draft.json.nextNodeKey = "Output#2";
    }
  } else {
    draft.json.nextNodeKey = "Output#2";
  }
  const endPoint = await dynamodb.getItem("etl_ds", {
    tb: draft.json.data.table,
    id: draft.json.data.dataset,
  });
  console.log(
    "startPoint",
    JSON.stringify(startPoint),
    "end Point:",
    JSON.stringify(endPoint)
  );
};
