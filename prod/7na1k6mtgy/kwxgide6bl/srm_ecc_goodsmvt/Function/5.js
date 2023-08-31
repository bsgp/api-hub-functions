module.exports = async (draft) => {
  // const { tryit, defined } = lib;
  const mvtCodeList = draft.pipe.json.mvtCodeList;
  const GoodsMovement = draft.pipe.json.GoodsMvt;
  const gMvt = GoodsMovement.body.result;
  const gMvtHeader = gMvt.GOODSMVT_HEADER;
  const gMvtItems = gMvt.GOODSMVT_ITEMS.filter((item) => !!item.PO_NUMBER);
  if (gMvtItems.length === 0) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "조건에 맞는 납품내역이 없습니다.",
      gMvt,
    };
    return;
  }
  const conversion = gMvtItems.map((item) => {
    const itemObj = {};
    Object.keys(item).forEach((key) => {
      if (item[key]) {
        itemObj[key] = item[key];
      }
    });
    const fMOVE_TYPE = mvtCodeList.find(
      (mCode) => mCode.code === item.MOVE_TYPE
    );
    if (fMOVE_TYPE.type === "in") {
      itemObj.QUANTITY = Number(itemObj.ENTRY_QNT);
    } else if (fMOVE_TYPE.type === "out") {
      itemObj.QUANTITY = -Number(itemObj.ENTRY_QNT);
    }
    const fHeader = gMvtHeader.find(
      (header) => header.MAT_DOC === itemObj.MAT_DOC
    );
    itemObj.PSTNG_DATE = fHeader.PSTNG_DATE;
    itemObj.UNIT = itemObj.ENTRY_UOM.toLowerCase();
    return itemObj;
  });

  const mats = conversion.map((item) => item.MATERIAL);
  const mList = mats
    .filter((item, idx) => mats.findIndex((it) => it === item) === idx)
    .map((material) => `MATNR EQ '${material}'`);
  const FIELDS = [
    { FIELDNAME: "MATNR", id: "MATERIAL" },
    { FIELDNAME: "MAKTX", id: "SHORT_TEXT" },
  ];

  const MAKT_Params = {
    QUERY_TABLE: "MAKT",
    DELIMITER: "|",
    OPTIONS: mList.map((mat, idx) =>
      idx === 0 ? { TEXT: mat } : { TEXT: `OR ${mat}` }
    ),
    FIELDS: FIELDS.map((field) => ({ FIELDNAME: field.FIELDNAME })),
  };

  draft.pipe.json.MAKT_Params = MAKT_Params;
  draft.pipe.json.FIELDS = FIELDS;
  draft.pipe.json.conversion = conversion;

  draft.response.body = {
    ...draft.response.body,
    E_STATUS: "S",
    gMvt,
    MAKT_Params,
  };
};
