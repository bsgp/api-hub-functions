module.exports = async (draft, { request, env }) => {
  // settings
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.url = [
    `https://${env.BYD_URL}`,
    "/sap/byd/odata/cust/v1/bsg_material/MaterialCollection",
  ].join("");
  draft.json.params = request.params;

  draft.response.body = { request };
};
