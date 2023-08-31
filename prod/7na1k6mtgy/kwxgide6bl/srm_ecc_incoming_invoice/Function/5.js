module.exports = async (draft) => {
  const incomingInv = draft.pipe.json.IncomingInv;
  const invoiceListData = incomingInv.body.result;
  const invListHeader = invoiceListData.HEADERLIST;

  const InvItem_Params = invListHeader.map((header) => ({
    INVOICEDOCNUMBER: header.INV_DOC_NO,
    FISCALYEAR: header.FISC_YEAR,
  }));
  draft.pipe.json.InvItemList = InvItem_Params;
  if (InvItem_Params.length === 0) {
    draft.json.nextNodeKey = "Output#2";
    draft.response.body = {
      ...draft.response.body,
      invListHeader,
      E_STATUS: "F",
      E_MESSAGE: "해당기간에 생성된 송장이 없습니다.",
    };
  } else {
    draft.pipe.json.InvItem_Params = InvItem_Params[0];
    draft.pipe.json.itemCount = InvItem_Params.length;
    draft.pipe.json.currentCount = 0;

    draft.json.nextNodeKey = "Loop#8";
    draft.response.body = {
      ...draft.response.body,
      invListHeader,
      InvItem_Params,
      invoiceItem: [],
    };
  }
};
