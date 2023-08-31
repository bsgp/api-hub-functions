module.exports = async (draft, { dynamodb, lib }) => {
  const datasetList = await dynamodb.query("etl_ds", {
    tb: draft.json.tableId,
  });

  const { createSorter } = lib;
  datasetList.sort(createSorter(["startedAt"], "desc"));

  draft.response.body = {
    count: datasetList.length,
    list: datasetList,
  };
};
