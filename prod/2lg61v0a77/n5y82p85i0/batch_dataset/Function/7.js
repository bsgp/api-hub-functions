module.exports = async (draft, { dynamodb, lib }) => {
  const datasetObj = await dynamodb.getItem("etl_ds", {
    tb: draft.json.tableId,
    id: draft.json.datasetId,
  });

  const versionObj = await dynamodb.getItem("etl_bver", {
    tbds: [draft.json.tableId, draft.json.datasetId].join("/"),
    id: draft.json.versionId,
  });

  const batchList = await dynamodb.query(
    "etl_batch",
    {
      tbds: [draft.json.tableId, draft.json.datasetId].join("/"),
    },
    {
      id: ["begins_with", `${draft.json.versionId}_`],
    }
  );

  const { createSorter } = lib;
  batchList.sort(createSorter(["startedAt"], "desc"));

  draft.response.body = {
    dataset: datasetObj,
    version: versionObj,
    batches: { count: batchList.length, list: batchList },
  };
};
