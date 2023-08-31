module.exports = async (draft) => {
  // const data = await dynamodb.getItem("etl_ds", {
  //   tb: draft.json.ds.table,
  //   id: draft.json.ds.dataset,
  // });

  draft.response.body = draft.json.ds;
};
