module.exports = async (draft) => {
  // const fnName = "BAPI_PO_GETDETAIL";
  const purchaseOrder = draft.pipe.json.purchaseOrder;
  const reqVENDOR = draft.pipe.json.VENDOR;

  draft.response.body.purchaseOrder = purchaseOrder;

  const poData = purchaseOrder.body.result;
  const header = poData.PO_HEADER || {};
  const headerText = poData.PO_HEADER_TEXTS || [];
  const items = poData.PO_ITEMS || [];
  const itemText = poData.PO_ITEM_TEXTS || [];
  const itemHistory = poData.PO_ITEM_HISTORY_TOTALS || [];
  const itemSchedule = poData.PO_ITEM_SCHEDULES || [];

  if (reqVENDOR !== header.VENDOR && reqVENDOR !== "*") {
    draft.response.body.E_STATUS = "F";
    draft.response.body.E_MESSAGE = "발주내역 권한이 없습니다";
    draft.response.body.E_DETAIL = { reqVENDOR, VENDOR: header.VENDOR };
    return;
  }

  items
    .filter((item) => item.DELETE_IND !== "L" && item.DELETE_IND !== "S")
    .forEach((item) => {
      const fText = itemText.find(
        (text) => text.PO_ITEM === item.PO_ITEM && text.TEXT_ID === "F04"
      );
      const hasHistory = itemHistory.filter(
        (history) => history.PO_ITEM === item.PO_ITEM
      );
      const DELIV_QTY =
        hasHistory.length > 0
          ? hasHistory.reduce((acc, curr) => {
              acc = Number(curr.DELIV_QTY) + acc;
              return acc;
            }, 0)
          : 0;
      const fSchedule = itemSchedule.find(
        (sch) => sch.PO_ITEM === item.PO_ITEM
      );
      const DELIV_DATE = fSchedule ? fSchedule.DELIV_DATE : "";
      const QUANTITY = Number(item.QUANTITY);
      const OVERDELTOL = Number(item.OVERDELTOL);
      const MAX_QTY = Math.round((100 + OVERDELTOL) * QUANTITY * 10) / 1000;
      const PO_Item = {
        VENDOR: header.VENDOR.replace(/^0*/, ""),
        VEND_NAME: header.VEND_NAME,
        PO_NUMBER: poData.PURCHASEORDER,
        DOC_DATE: header.DOC_DATE,
        PUR_GROUP: header.PUR_GROUP,
        INV_DESC: headerText
          .filter((item) => item.TEXT_ID === "F01")
          .map((text) => text.TEXT_LINE)
          .join(" "),
        SHIP_TO: "",
        APROVAL_STATUS: false,
        PO_ITEM: item.PO_ITEM.replace(/^0*/, ""),
        MATERIAL: item.MATERIAL.replace(/^0*/, ""),
        SHORT_TEXT: item.SHORT_TEXT,
        PLANT: item.PLANT,
        STORE_LOC: item.STORE_LOC,
        QUANTITY,
        DELIV_QTY,
        DELIV_DATE,
        OVERDELTOL,
        MAX_QTY,
        UNIT_QTY: 1,
        UNIT: (item.UNIT || "").toLowerCase(),
        UNIT_VALUE: Number(item.NET_PRICE),
        NET_VALUE: Number(item.NET_VALUE),
        CURRENCY: (header.CURRENCY || "").toLowerCase(),
        ITEM_DESC: fText ? fText.TEXT_LINE : "",
        RET_ITEM: item.RET_ITEM,
      };

      draft.response.body.conversion.push(PO_Item);
    });

  // const currentCount = draft.pipe.json.currentCount;
  // draft.pipe.json.currentCount = currentCount + 1;
  // draft.pipe.json.PO_Params = draft.pipe.json.PO_List[currentCount + 1];
};
