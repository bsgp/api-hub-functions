module.exports = async (draft, { dynamodb }) => {
  draft.json.ds.currentBatchCount += 1;
  const oldItem = await dynamodb.getItem("etl_ds", {
    tb: draft.json.ds.table,
    id: draft.json.ds.dataset,
  });

  draft.json.ds = await dynamodb.updateItem(
    "etl_ds",
    {
      tb: draft.json.ds.table,
      id: draft.json.ds.dataset,
    },
    { ...draft.json.ds, lOcKkEy: oldItem && oldItem.lOcKkEy }
  );

  const bverData = await dynamodb.getItem("etl_bver", {
    tbds: [draft.json.ds.table, draft.json.ds.dataset].join("/"),
    id: draft.json.ds.version,
  });

  await dynamodb.updateItem(
    "etl_bver",
    {
      tbds: [draft.json.ds.table, draft.json.ds.dataset].join("/"),
      id: draft.json.ds.version,
    },
    { ...draft.json.ds, lOcKkEy: bverData.lOcKkEy }
  );
};
