module.exports = async (draft, { restApi }) => {
  // const { getIpViaDns } = lib;

  // const result = await getIpViaDns("172.20.10.11", "cscapi.qa.golfzon.com");
  // const result = await restApi.get({
  //   subAction: "GetIpViaDns",
  //   dnsIp: "172.20.10.11",
  //   domain: "cscapi.qa.golfzon.com",
  // });
  // const params = new URLSearchParams();
  // params.set("I_BUKRS", "2000");
  // params.set("I_DATE_FROM", "20220901");
  // params.set("I_DATE_TO", "20220930");
  // params.set("I_DCTYP", "BZM02");

  const result = await restApi.post({
    url: [
      // "http://bizmall.qa.golfzon.com/gz/erp/iffibzm.do",
      draft.json.url,
      draft.json.queryString,
    ].join("?"),
  });

  draft.response.statusCode = result.statusCode;
  draft.response.body = JSON.stringify(result.body);
};
