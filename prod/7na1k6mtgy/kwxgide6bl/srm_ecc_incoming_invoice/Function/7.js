module.exports = async (draft) => {
  const incomingInvItems = draft.pipe.json.InvItem;
  const invoiceItemData = incomingInvItems.body.result;

  const currentCount = draft.pipe.json.currentCount;
  const InvItem_Params = draft.pipe.json.InvItemList;
  draft.response.body.invoiceItem.push(invoiceItemData);
  draft.pipe.json.InvItem_Params = InvItem_Params[currentCount + 1];
  draft.pipe.json.currentCount = currentCount + 1;
};
