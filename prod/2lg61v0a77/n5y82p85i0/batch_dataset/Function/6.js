module.exports = async (draft, { dynamodb, lib }) => {
  const datasetObj = await dynamodb.getItem("etl_ds", {
    tb: draft.json.tableId,
    id: draft.json.datasetId,
  });

  const batchVersionList = await dynamodb.query("etl_bver", {
    tbds: [draft.json.tableId, draft.json.datasetId].join("/"),
  });

  const { createSorter } = lib;
  batchVersionList.sort(createSorter(["startedAt"], "desc"));

  draft.response.body = {
    dataset: datasetObj,
    versions: { count: batchVersionList.length, list: batchVersionList },
  };
};
