module.exports = async (draft, { file, sql }) => {
  if (draft.response.body.E_STATUS === "F") {
    return;
  }
  const conversion = draft.response.body.conversion;
  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });
  const dbName = tables.ORDER_ITEMS.name;
  const query = sql("mysql").select(dbName);

  query.where("PO_NUMBER", "like", conversion.PO_NUMBER);
  const queryResult = await query.run();
  if (queryResult.statusCode === 200) {
    if (queryResult.body.list.length > 0) {
      conversion.approveStatus = true;
      conversion.IDN_CREATED_NUMBER =
        queryResult.body.list[0].IDN_CREATED_NUMBER;
      conversion.ITEMS = conversion.ITEMS.map((item) => {
        const fItem =
          queryResult.body.list.find(
            (listItem) => listItem.ITEM_ID === item.PO_ITEM
          ) || {};
        conversion.IDN_CREATED_NUMBER =
          conversion.IDN_CREATED_NUMBER < fItem.IDN_CREATED_NUMBER
            ? fItem.IDN_CREATED_NUMBER
            : conversion.IDN_CREATED_NUMBER;
        return {
          ...item,
          APROVAL_STATUS: true,
          IDN_CREATED_NUMBER: fItem.IDN_CREATED_NUMBER,
          REST_QTY: fItem ? fItem.REST_QTY : item.QUANTITY,
        };
      });
    } else {
      conversion.approveStatus = false;
    }
    draft.response.body.E_STATUS = "S";
  }
};
