module.exports = async (draft) => {
  const purchaseGroup = draft.pipe.json.purchaseGroup;
  const purchaseOrders = draft.pipe.json.purchaseOrders;

  if (purchaseOrders.statusCode !== 200) {
    draft.response.statusCode = 400;
    draft.response.body = {
      message: "rfc call error occurred",
    };
    return;
  }

  const pgData = purchaseGroup.body.result;
  const poData = purchaseOrders.body.result;
  const result = poData.PO_HEADERS.map((po) => {
    const fGroup =
      pgData.ET_VALUES.find((pg) => pg.EKGRP === po.PUR_GROUP) || {};
    const poItems = poData.PO_ITEMS.filter(
      (item) => item.PO_NUMBER === po.PO_NUMBER
    );
    return {
      APROVAL_STATUS: false,
      DOC_DATE: po.DOC_DATE,
      VENDOR: po.VENDOR.replace(/^0*/, ""),
      VEND_NAME: po.VEND_NAME,
      PO_NUMBER: po.PO_NUMBER,
      ENTRY_COUNT: poItems.length,
      PUR_GROUP: po.PUR_GROUP,
      PUR_GROUP_NAME: fGroup.EKNAM,
      TEL: fGroup.TEL_NUMBER,
      EMAIL: fGroup.SMTP_ADDR,
      INV_DESC: "",
    };
  });

  draft.response.body.purchaseOrders = purchaseOrders;
  draft.response.body.purchaseGroup = purchaseGroup;
  draft.response.body.conversion = result;
  draft.response.body.E_STATUS = "S";
};
