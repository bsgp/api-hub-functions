module.exports = async (draft) => {
  // your script
  draft.pipe.json.currentCount = 0;
  const PO_List = draft.pipe.json.PO_List.filter(
    (po, idx) =>
      draft.pipe.json.PO_List.findIndex(
        (item) => item.PURCHASEORDER === po.PURCHASEORDER
      ) === idx
  );
  draft.pipe.json.PO_List = PO_List;
  draft.pipe.json.PO_Count = PO_List.length;
  draft.response.body.PO_List = PO_List;
  if (PO_List.length > 0) {
    draft.json.nextNodeKey = "Loop#6";
    draft.pipe.json.PO_Params = PO_List[0];
  } else {
    draft.json.nextNodeKey = "Output#2";
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "S",
      E_MESSAGE: "해당조건에 맞는 발주내역이 존재하지 않습니다.",
      PO_List,
      PO_Count: PO_List.length,
    };
  }
};
