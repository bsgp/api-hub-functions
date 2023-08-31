module.exports = async (draft) => {
  const PO = draft.response.body.purchaseorder;
  const each = draft.response.body.conversion.each;

  draft.response.body.conversion.each = each.map((item) => {
    const fPO = PO.find((po) => item.PO_NUMBER === po.PURCHASEORDER);
    if (fPO) {
      const PO_ITEMS = fPO.PO_ITEMS;
      const fItem = PO_ITEMS.find((poItem) => item.PO_ITEM === poItem.PO_ITEM);
      return fItem
        ? {
            ...item,
            PO_ITEM: item.PO_ITEM.replace(/^0*/, ""),
            MATERIAL: fItem.MATERIAL.replace(/^0*/, ""),
            SHORT_TEXT: fItem.SHORT_TEXT,
          }
        : item;
    } else return { ...item, PO_ITEM: item.PO_ITEM.replace(/^0*/, "") };
  });

  draft.response.body.E_STATUS = "S";
  draft.response.body.E_MESSAGE = "조회가 완료되었습니다.";
};

// index: idx + 1,
// INV_DOC_NO: doc.INVOICEDOCNUMBER,
// PSTNG_DATE: doc.HEADERDATA.PSTNG_DATE,
// PO_NUMBER: item.PO_NUMBER,
// PO_ITEM: item.PO_ITEM,
// MATERIAL: "",
// SHORT_TEXT: "",
// QUANTITY: item.QUANTITY,
// UNIT: item.PO_UNIT,
// ITEM_AMOUNT:
//   item.DEBIT_CREDIT_INDICATOR === "S"
//     ? Number(item.ITEM_AMOUNT)
//     : -Number(item.ITEM_AMOUNT),
// DEBIT_CREDIT_INDICATOR: item.DEBIT_CREDIT_INDICATOR,
// AMOUNT_TEXT: item.ITEM_AMOUNT,
// CURRENCY: doc.HEADERDATA.CURRENCY,
// FISCALYEAR: doc.FISCALYEAR,
