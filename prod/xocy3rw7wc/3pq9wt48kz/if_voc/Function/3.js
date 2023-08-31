module.exports = async (draft, { restApi }) => {
  // const { getIpViaDns } = lib;

  // const result = await getIpViaDns("172.20.10.11", "cscapi.qa.golfzon.com");
  // const result = await restApi.get({
  //   subAction: "GetIpViaDns",
  //   dnsIp: "172.20.10.11",
  //   domain: "cscapi.qa.golfzon.com",
  // });
  const params = new URLSearchParams();
  params.set("bukrs", "2000");
  params.set("date_from", "20220801");
  params.set("date_to", "20220831");
  params.set("dctyp", "BZM01");

  const result = await restApi.post({
    url: [
      "http://bizmall.qa.golfzon.com/gz/erp/iffibzm.do",
      params.toString(),
    ].join("?"),
  });

  draft.response.body.result = result;
};
