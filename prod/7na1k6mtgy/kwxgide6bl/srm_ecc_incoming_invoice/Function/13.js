module.exports = async (draft) => {
  const poRes = draft.pipe.json.PurchaseOrder;
  const poData = poRes.body.result;

  const currentCount = draft.pipe.json.currentCount || 0;
  const PO_List = draft.pipe.json.PO_List;
  draft.response.body.purchaseorder.push(poData);
  draft.pipe.json.PO_Params = PO_List[currentCount + 1];
  draft.pipe.json.currentCount = currentCount + 1;
};
