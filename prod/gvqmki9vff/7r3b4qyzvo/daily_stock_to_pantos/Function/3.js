module.exports = async (draft, { odata }) => {
  draft.response.body = [];

  const isTest = draft.pipe.json.isTest;

  const pid = isTest ? "my356725" : "my357084";
  const username = "cfo";
  const password = "Lguklghq2022";
  const reportNum = "Z4598AAD9A4214E7FB4CF73";
  const select = [
    "TMATERIAL_UUID",
    "CMATERIAL_UUID",
    "CSITE_UUID",
    "TSITE_UUID",
    "KCON_HAND_STOCK",
    "KCRESTRICTED_STOCK",
    "KCUN_RESTRICTED_STOCK",
  ];
  const filter = "(CSITE_UUID eq '9000')";
  const queryString = [
    `$select=${select.join(",")}`,
    `&$filter=${filter}`,
    "&$format=json",
  ].join("");

  const url = [
    `https://${pid}.sapbydesign.com`,
    "/sap/byd/odata/ana_businessanalytics_analytics.svc",
    `/RP${reportNum}QueryResults?`,
    queryString,
  ].join("");

  const stock = await odata.get({ url, username, password });

  draft.pipe.json.stock = stock.d.results;
};
