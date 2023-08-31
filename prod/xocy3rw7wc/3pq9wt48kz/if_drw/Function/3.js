const xml2js = require("xml2js");

function snakeCase(str) {
  // var s = 'TypeOfData.AlphaBeta';
  // MotorRMP => motor_r_m_p
  return str
    .replace(/(?:^|\.?)([A-Z])/g, function (x, y) {
      return "_" + y.toLowerCase();
    })
    .replace(/^_/, "");
  // MotorRMP => motor_rmp
  // return str
  //   .replace(/\.?([A-Z]+)/g, function (x, y) {
  //     return "_" + y.toLowerCase();
  //   })
  //   .replace(/^_/, "");
}

module.exports = async (draft, { restApi, request, lib, log }) => {
  const { tryit, keysUp, isObject, clone } = lib;

  function arrayToValue(obj) {
    const columns = {};
    const newObj = Object.keys(obj).reduce((acc, key) => {
      columns[key] = "";
      acc[key] = obj[key].length === 1 ? obj[key][0] : obj[key];
      if (isObject(acc[key])) {
        columns[key] = {};
        const result = arrayToValue(acc[key]);
        columns[key] = { ...result.columns };
        acc[key] = result.newObj;
      }
      return acc;
    }, {});
    return { columns, newObj };
  }
  // function objToArray(obj) {
  //   return Object.keys(obj).map((key) => {
  //     if (isObject(obj[key])) {
  //       return {
  //         [key.toUpperCase()]: objToArray(obj[key]),
  //       };
  //     }
  //     return key.toUpperCase();
  //   });
  // }

  const { Name: ifName, Url: url } = draft.json.ifObj;
  const subName = snakeCase(ifName).split("_").pop();

  const body = [
    "<soapenv:Envelope ",
    'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ',
    'xmlns:gol="http://golfzone.local/">',
    "<soapenv:Header/><soapenv:Body>",
    `<gol:${ifName}/></soapenv:Body></soapenv:Envelope>`,
  ].join("");
  // const url = "http://drwapi.golfzon.local:8880/DrwBizIF/igroupware.asmx";

  const result = await restApi.post({
    url,
    headers: {
      // ...request.body.Headers,
      "Content-Type": "text/xml; charset=UTF-8",
      SOAPAction: `http://golfzone.local/${ifName}`,
    },
    body,
  });

  const isResXml = result.headers["content-type"].search("text/xml") >= 0;

  if (isResXml && !request.body.Original) {
    const resJson = await xml2js.parseStringPromise(result.body);

    log("xml original:", result);
    log("json converted:", resJson);

    const countNumber = tryit(
      () =>
        parseInt(
          resJson["soap:Envelope"]["soap:Body"][0][`${ifName}Response`][0][
            `${ifName}Result`
          ][0][`${subName}s`][0]["$"].count,
          10
        ),
      0
    );
    const jobs = tryit(
      () =>
        resJson["soap:Envelope"]["soap:Body"][0][`${ifName}Response`][0][
          `${ifName}Result`
        ][0][`${subName}s`][0][subName]
    );
    if (jobs) {
      const columns = {};

      const finalData = jobs.map((each) => {
        const result = arrayToValue(each);
        Object.keys(result.columns).forEach((colKey) => {
          columns[colKey] = result.columns[colKey];
        });
        return result.newObj;
      });

      // console.log(JSON.stringify(objToArray(columns)));

      draft.response.body = {
        // IT_COLUMNS: objToArray(columns),
        I_COUNT: countNumber,
        IT_DATA: finalData.map(keysUp),
      };

      draft.json.rfcBody = clone(request.body);

      delete draft.json.rfcBody.Data;
      draft.json.rfcBody.Data = {
        I_JSON: JSON.stringify(draft.response.body.IT_DATA),
        I_COUNT: draft.response.body.I_COUNT,
      };

      log("json final:", draft.json.rfcBody.Data);
    } else {
      draft.response.body = resJson;
      draft.json.terminateFlow = true;
    }
  } else {
    if (request.body.OriginalJson === true) {
      const resJson = await xml2js.parseStringPromise(result.body);

      const jobs = tryit(
        () =>
          resJson["soap:Envelope"]["soap:Body"][0][`${ifName}Response`][0][
            `${ifName}Result`
          ][0][`${subName}s`][0]
      );

      const countNumber = tryit(
        () =>
          parseInt(
            resJson["soap:Envelope"]["soap:Body"][0][`${ifName}Response`][0][
              `${ifName}Result`
            ][0][`${subName}s`][0]["$"].count,
            10
          ),
        0
      );

      draft.response.body = {
        I_JSON: JSON.stringify(jobs),
        I_COUNT: countNumber,
      };
    } else {
      draft.response.body = result;
    }
    draft.json.terminateFlow = true;
  }
};
