module.exports = async (draft, { file, sql }) => {
  const conversion = draft.response.body.conversion || [];
  if (conversion.length === 0) {
    return;
  }
  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });
  const dbName = tables.ORDER_ITEMS.name;
  const query = sql("mysql").select(dbName);

  query.where(
    "PO_NUMBER",
    "in",
    conversion.map((po) => po.PO_NUMBER)
  );
  const queryResult = await query.run();
  if (queryResult.statusCode === 200) {
    const approvalList = queryResult.body.list;
    draft.response.body.conversion = conversion.map((po) => ({
      ...po,
      APROVAL_STATUS: !!approvalList.find(
        (item) => item.PO_NUMBER === po.PO_NUMBER
      ),
    }));

    draft.response.body.E_STATUS = "S";
  } else {
    draft.response.body.approvalResult = queryResult;
  }
};
