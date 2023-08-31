module.exports = async (draft, { request, env }) => {
  // settings
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.odataService = [
    `https://${env.BYD_URL}`,
    "/sap/byd/odata/cust/v1/",
    "bsg_supplier/SupplierCollection",
  ].join("");

  draft.response.body = { ...request };
};
