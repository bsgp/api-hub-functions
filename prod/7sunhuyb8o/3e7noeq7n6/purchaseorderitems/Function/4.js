module.exports = async (
  draft
  // { request }
) => {
  // 	draft.json.username = env.BYD_ID;
  // draft.json.password = env.BYD_PASSWORD;
  // draft.json.rootURL = [`${env.BYD_URL}`, "/sap/byd/odata/cust/v1"].join("");
  draft.response.body = { ...draft.response.body };
};
