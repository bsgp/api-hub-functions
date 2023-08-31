module.exports = async (draft, { restApi, request, lib }) => {
  const { getSize } = lib;
  // const { getIpViaDns } = lib;

  // const result = await getIpViaDns("172.20.10.11", "cscapi.qa.golfzon.com");
  // const result = await restApi.get({
  //   subAction: "GetIpViaDns",
  //   dnsIp: "172.20.10.11",
  //   domain: "cscapi.qa.golfzon.com",
  // });
  const params = new URLSearchParams();
  params.set("op", "getPerson");
  // params.set("I_DATE_FROM", "20220901");
  // params.set("I_DATE_TO", "20220930");
  // params.set("I_DCTYP", "BZM02");
  const body = [
    "<soapenv:Envelope ",
    'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ',
    'xmlns:gol="http://golfzone.local/">',
    "<soapenv:Header/><soapenv:Body>",
    "<gol:getAddJob/></soapenv:Body></soapenv:Envelope>",
  ].join("");
  const url = "http://drwapi.golfzon.local:8880/DrwBizIF/igroupware.asmx";
  const result = await restApi.post({
    url,
    // url: [
    //   // "http://bizmall.qa.golfzon.com/gz/erp/iffibzm.do",
    //   "http://drwapi.golfzon.local:8880/DrwBizIF/igroupware.asmx",
    //   // params.toString(),
    // ].join("?"),
    headers: {
      ...request.body.Headers,
      "Content-Length": getSize(body).toString(),
      // "Content-Type": "text/xml; charset=UTF-8",
      // accept: "text/xml;charset=UTF-8",
      // // SOAPAction: "http://golfzone.local/getAddJob",
      // soapAction: "http://golfzone.local/getPerson",
    },
    // body: `<soapenv:Envelope
    //     xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    //     xmlns:gol="http://golfzone.local/">
    //   <soapenv:Header/>
    //   <soapenv:Body>
    //       <gol:getAddJob/>
    //   </soapenv:Body>
    // </soapenv:Envelope>`,
    body,
  });

  // draft.response.statusCode = result.statusCode;
  draft.response.body = result;
};
