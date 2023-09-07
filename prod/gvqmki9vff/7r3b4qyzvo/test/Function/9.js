module.exports = async (draft, { file, sql }) => {
  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });

  const dbName = tables.Invoice.name;
  const query = sql("mysql").select(dbName);
  query.where("CUSTOMER", "like", "C1003");
  query.orderBy("ID", "desc").limit(1);
  const queryResult = await query.run();

  draft.response.body = {
    tables,
    queryResult,
  };
};
