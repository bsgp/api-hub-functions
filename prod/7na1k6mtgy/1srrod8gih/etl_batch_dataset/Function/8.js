module.exports = async (draft, { dynamodb }) => {
  try {
    await dynamodb.updateItem(
      "etl_bver",
      {
        tbds: [draft.json.tableId, draft.json.datasetId].join("/"),
        id: draft.json.versionId,
      },
      {
        status: "Terminated",
      },
      {
        conditions: {
          status: {
            operation: "<>",
            value: "Finished",
          },
        },
      }
    );
  } catch (ex) {
    draft.response.body = {
      errorMessage: "Current Version is finished, and is not terminatable",
    };
    draft.json.terminateFlow = true;
    return;
  }

  await dynamodb.updateItem(
    "etl_ds",
    {
      tb: draft.json.tableId,
      id: draft.json.datasetId,
    },
    {
      status: "Terminated",
    }
  );

  const batchList = await dynamodb.query(
    "etl_batch",
    {
      tbds: [draft.json.tableId, draft.json.datasetId].join("/"),
    },
    {
      id: ["begins_with", `${draft.json.versionId}_`],
      status: ["<>", "Finished"],
    }
  );
  const promises = batchList.map((each) => {
    return dynamodb.updateItem(
      "etl_batch",
      {
        tbds: [draft.json.tableId, draft.json.datasetId].join("/"),
        id: each.id,
      },
      {
        status: "Terminated",
      }
    );
  });

  await Promise.all(promises);
};
