module.exports = async (draft) => {
  const purchaseOrder = draft.json.purchaseOrder;

  draft.response.body = {
    ...draft.response.body,
    purchaseOrder,
  };
};
