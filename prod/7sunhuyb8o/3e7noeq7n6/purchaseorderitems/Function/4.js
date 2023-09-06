module.exports = async (draft, { fn, dayjs }) => {
  const params = draft.json.params;
  // 	draft.json.username = env.BYD_ID;
  // draft.json.password = env.BYD_PASSWORD;
  const queryStringObj = fn.getPO_ItemParams(params, dayjs);
  const queryString = Object.keys(queryStringObj)
    .map((key) => `${key}=${queryStringObj[key]}`)
    .join("&");
  const url = [
    draft.json.rootURL,
    "/bsg_purchaseorder/ItemCollection?",
    queryString,
  ].join("");
  draft.response.body = { ...draft.response.body, params, url };
};
