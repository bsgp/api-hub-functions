module.exports = async (draft, { odata }) => {
  const routeTo = {
    exit: "Output#2",
  };
  const setFailedResponse = (msg, statusCd = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCd;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const { requestQuery } = draft.json;
  const { odata_entity, odata_account, odata_queries } = requestQuery;

  const { url, id, password } = odata_account;
  // odata_queries
  // { odata_select, odata_expand, odata_filter, odata_orderby }

  const odataURL = [url, odata_entity, "?", getQueryStr(odata_queries)].join(
    ""
  );

  const odataResponse = await odata.get({
    url: odataURL,
    username: id,
    password: password,
  });

  if (odataResponse.ResponseError) {
    setFailedResponse(odataResponse.ResponseError);
    return;
  }

  draft.response.body = odataResponse.d;
};

function getQueryStr(odata_queries) {
  const queryStr = ["$format=json", "$inlinecount=allpages", "$top=9999"];

  for (const [key, value] of Object.entries(odata_queries)) {
    if (value) {
      queryStr.push([key.replace("odata_$", "$"), value].join("="));
    }
  }

  return queryStr.join("&");
}
