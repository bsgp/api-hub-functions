module.exports = async (draft, { sql }) => {
  const builder = sql("oracledb", {
    url: "3.37.85.6:1521",
    database: "DNAMDEV",
    user: "HCMIF",
    password: "qwer12#$",
  });
  const query = builder.select("PW_IF_COST_CENTER_T");
  const result = await query.run();

  draft.response.body = result;
};
