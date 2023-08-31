module.exports = async (draft, { lib }) => {
  // const fnName = "BAPI_PO_GETITEMS";
  const { tryit } = lib;
  const PO_results = tryit(
    () => draft.pipe.json.purchaseOrders.body.result,
    {}
  );
  draft.response.body.purchaseOrders.push(PO_results);

  const resultHeader = PO_results.PO_HEADERS || [];
  resultHeader.forEach((header) =>
    draft.pipe.json.PO_List.push({
      PURCHASEORDER: `${header.PO_NUMBER}`,
      ITEMS: "X",
      SCHEDULES: "X",
      HISTORY: "X",
      ITEM_TEXTS: "X",
      HEADER_TEXTS: "X",
    })
  );

  const currentCount = draft.pipe.json.currentCount;
  draft.pipe.json.currentCount = currentCount + 1;
  const DOC_DATE = draft.pipe.json.DATES[currentCount + 1];
  draft.pipe.json.PO_List_Params.DOC_DATE = DOC_DATE;
};
