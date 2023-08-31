module.exports = async (draft, { env }) => {
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.url = [`https://${env.BYD_URL}`, "/sap/byd/odata/cust/v1"].join(
    ""
  );
};
