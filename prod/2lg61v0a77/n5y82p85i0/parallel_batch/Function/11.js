module.exports = async (draft, { dynamodb }) => {
  // const dsPath = draft.json.dataSetPath;

  // const data = await file.get(dsPath, {
  //   gziped: true,
  //   toJSON: true,
  //   ignoreEfs: true,
  // });
  // const data = await dynamodb.getItem("etl_ds", {
  //   tb: draft.json.ds.table,
  //   id: draft.json.ds.dataset,
  // });

  // if (draft.json.ds.batches === undefined) {
  //   draft.json.ds.batches = {};
  // }

  // const batch = draft.response.body.batch;
  // if (batch) {
  //   draft.json.ds.batches[batch] = { ...draft.response.body };
  // }

  draft.json.ds.currentBatchCount += 1;

  // await file.upload(dsPath, data, { gzip: true });
  await dynamodb.updateItem(
    "etl_ds",
    {
      tb: draft.json.ds.table,
      id: draft.json.ds.dataset,
    },
    draft.json.ds
  );
  await dynamodb.updateItem(
    "etl_bver",
    {
      tbds: [draft.json.ds.table, draft.json.ds.dataset].join("/"),
      id: draft.json.ds.version,
    },
    draft.json.ds
  );
};
