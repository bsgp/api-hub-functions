module.exports = async (draft) => {
  // const fnName = "BAPI_PO_GETDETAIL";
  const purchaseGroup = draft.pipe.json.purchaseGroup;
  const purchaseOrder = draft.pipe.json.purchaseOrder;

  draft.response.body.purchaseOrder = purchaseOrder;

  const pgData = purchaseGroup.body.result;
  const poData = purchaseOrder.body.result;
  const header = poData.PO_HEADER || {};
  const headerText = poData.PO_HEADER_TEXTS || [];
  // const address = poData.PO_ADDRESS || {};
  const items = poData.PO_ITEMS || [];
  const itemText = poData.PO_ITEM_TEXTS || [];
  const itemHistory = poData.PO_ITEM_HISTORY_TOTALS || [];
  const itemSchedule = poData.PO_ITEM_SCHEDULES || [];
  const fGroup =
    pgData.ET_VALUES.find((pg) => pg.EKGRP === header.PUR_GROUP) || {};

  let NET_VALUE = 0;

  const VENDOR = header.VENDOR.replace(/^0*/, "").toLowerCase();
  const reqVENDOR = draft.pipe.json.VENDOR;
  if (reqVENDOR) {
    if (VENDOR !== `${reqVENDOR}`.toLowerCase()) {
      draft.json.nextNodeKey = "Function#9";
      draft.response.body.E_STATUS = "F";
      draft.response.body.E_MESSAGE = "권한을 가진 발주정보가 아닙니다.";
      draft.response.body.E_DETAIL = {
        VENDOR,
        reqVENDOR,
        poData: { ...poData },
      };
      return;
    }
  }

  const po = {
    VENDOR,
    VEND_NAME: header.VEND_NAME,
    PO_NUMBER: poData.PURCHASEORDER,
    DOC_DATE: header.DOC_DATE,
    PUR_GROUP: header.PUR_GROUP,
    PUR_GROUP_NAME: fGroup.EKNAM,
    CURRENCY: header.CURRENCY,
    TEL: fGroup.TEL_NUMBER,
    EMAIL: fGroup.SMTP_ADDR,
    INV_DESC: headerText
      .filter((item) => item.TEXT_ID === "F01")
      .map((text) => text.TEXT_LINE)
      .join(" "),
    SHIP_TO: "",
    ITEMS: items
      .filter((item) => item.DELETE_IND !== "L" && item.DELETE_IND !== "S")
      .map((item) => {
        NET_VALUE += Number(item.NET_VALUE);
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
        return {
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
          UNIT: item.UNIT,
          UNIT_VALUE: Number(item.NET_PRICE),
          NET_VALUE: Number(item.NET_VALUE),
          CURRENCY: (header.CURRENCY || "").toLowerCase(),
          INV_DESC: fText ? fText.TEXT_LINE : "",
          RET_ITEM: item.RET_ITEM,
        };
      }),
  };
  const result = {
    ...po,
    NET_VALUE,
    PLANT: po.ITEMS[0] ? po.ITEMS[0].PLANT : "",
  };
  draft.response.body.conversion = result;
  if (result.PLANT) {
    draft.json.nextNodeKey = "RFC#7";
  } else {
    draft.json.nextNodeKey = "Function#9";
  }
};
