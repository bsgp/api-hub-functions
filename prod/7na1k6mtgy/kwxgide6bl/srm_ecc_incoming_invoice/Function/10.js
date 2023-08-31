module.exports = async (draft) => {
  const invListHeader = draft.response.body.invListHeader;
  const invoiceItemList = draft.response.body.invoiceItem;
  const invoiceItems = [];
  invoiceItemList.forEach((doc) => {
    doc.ITEMDATA.forEach((item) =>
      invoiceItems.push({
        INV_DOC_NO: doc.INVOICEDOCNUMBER,
        PSTNG_DATE: doc.HEADERDATA.PSTNG_DATE,
        PO_NUMBER: item.PO_NUMBER,
        PO_ITEM: item.PO_ITEM,
        MATERIAL: "",
        SHORT_TEXT: "",
        QUANTITY: item.QUANTITY,
        UNIT: item.PO_UNIT,
        ITEM_AMOUNT:
          item.DEBIT_CREDIT_INDICATOR === "S"
            ? Number(item.ITEM_AMOUNT)
            : -Number(item.ITEM_AMOUNT),
        DEBIT_CREDIT_INDICATOR: item.DEBIT_CREDIT_INDICATOR,
        AMOUNT_TEXT: item.ITEM_AMOUNT,
        CURRENCY: doc.HEADERDATA.CURRENCY,
        FISCALYEAR: doc.FISCALYEAR,
      })
    );
  });
  const conversion = {
    total: invListHeader.map((head, idx) => ({
      index: idx + 1,
      INV_DOC_NO: head.INV_DOC_NO,
      PSTNG_DATE: head.PSTNG_DATE,
      ITEM_AMOUNT: head.GROSS_AMNT,
      CURRENCY: head.CURRENCY,
      FISCALYEAR: head.FISC_YEAR,
    })),
    each: invoiceItems
      .sort((al, be) => {
        if (Number(al.PO_NUMBER) === Number(be.PO_NUMBER)) {
          return Number(al.PSTNG_DATE) - Number(be.PSTNG_DATE);
        }
        return Number(al.PO_NUMBER) - Number(be.PO_NUMBER);
      })
      .map((item, idx) => ({ ...item, index: idx + 1 })),
  };
  const PO_List = invoiceItems
    .filter(
      (item, idx) =>
        invoiceItems.findIndex((inv) => inv.PO_NUMBER === item.PO_NUMBER) ===
        idx
    )
    .map((item) => ({
      PURCHASEORDER: item.PO_NUMBER,
      ITEMS: "X",
      SCHEDULES: "X",
      HISTORY: "X",
      ITEM_TEXTS: "X",
      HEADER_TEXTS: "X",
    }));
  draft.pipe.json.PO_List = PO_List;
  draft.pipe.json.PO_Params = PO_List[0];
  draft.pipe.json.poCount = PO_List.length;
  draft.pipe.json.currentCount = 0;
  draft.response.body.purchaseorder = [];
  draft.response.body.PO_List = PO_List;
  draft.response.body.conversion = conversion;
};
