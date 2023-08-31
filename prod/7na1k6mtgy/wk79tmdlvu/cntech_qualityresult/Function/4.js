module.exports = async (draft, { file, odata, lib }) => {
  const { url, id, password, tennant } = draft.json;
  const { tryit } = lib;
  const skipData = await tryit(() =>
    file.get(`/cntech/${tennant}/skip.txt`, { gziped: true })
  );
  const skip = Number(skipData) || 0;
  if (skip > 74281) {
    draft.json.skip = skip || 0;
    draft.response.body = {
      ...draft.response.body,
      result: "end",
    };
    return;
  }
  const top = 100;
  const filter = [
    "$format=json",
    `$top=${top}`,
    skip ? `$skip=${skip}` : "",
    "$filter=QC_REPORT_KUT ne ''",
    "$orderby=CreationDateTime asc",
    "$inlinecount=allpages",
  ]
    .filter(Boolean)
    .join("&");

  const odataURL = [
    url,
    "/sap/byd/odata/cust/v1/",
    "bsg_istock/IdentifiedStockCollection?",
    filter,
  ].join("");

  const iStockData = await odata.get({ url: odataURL, username: id, password });
  draft.json.iStockData = iStockData;
  draft.json.skip = skip || 0;
  draft.json.skipNext = skip + top;

  draft.response.body = {
    ...draft.response.body,
    odataURL,
  };
};
