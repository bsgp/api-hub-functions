module.exports = async (draft, { sql }) => {
  const dbConfig = {
    user: "iHubService",
    port: 1433,
    password: "vpvjalsxm3#",
    database: "SAPIF",
    url: "172.20.109.8",
  };

  const builder = sql("mssql", dbConfig);
  draft.pipe.ref.builder = builder;
  // const query = builder.select("TWMS_S_WORKORDER").limit(10);
  // const selResult = await query.run();
  // draft.response = selResult;

  draft.pipe.json.connection = {
    ashost: "172.31.40.11",
    sysnr: "01",
    client: "100",
    user: "sapifwms",
    passwd: "sapifwms00",
    lang: "ko",
  };
};
