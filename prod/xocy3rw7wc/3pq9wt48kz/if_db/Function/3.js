module.exports = async (draft, { request, sql, clone, kst }) => {
  const { ifObj } = draft.json;
  const [url, port] = ifObj.Domain.split(":");

  const dbConfig = {
    user: "GDRBI",
    port: Number(port),
    password: "wleldkfqldkdl1!",
    database: ifObj.DbName,
    url,
  };

  const builder = sql("mssql", dbConfig);
  draft.ref.builder = builder;

  draft.json.body = clone(request.body);
  if (request.method === "TASK") {
    if (ifObj.InterfaceId === "IF-CO-SAC02") {
      draft.json.body.Data.I_DATE = kst
        .subtract(1, "months")
        .startOf("month")
        .format("YYYYMMDD");
    }
  }
};
