module.exports = async (draft, { env, file }) => {
  const path = `config/srm/${env.BYD_TENANT}.json`;
  const extensionData = await file.get(path, {
    gziped: true,
    toJSON: true,
  });
  const purchaseOrder = draft.json.purchaseOrder;

  draft.json.extensionData = extensionData;
  draft.response.body = {
    ...draft.response.body,
    purchaseOrder,
    extensionData,
  };
};
