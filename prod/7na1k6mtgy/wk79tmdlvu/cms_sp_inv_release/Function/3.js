module.exports = async (draft, { request, kst, fn, env }) => {
  /** require */
  const xml2js = require("xml2js");
  const https = require("https");
  /** env settings */
  const hostname = env.SOAP_M_SIN_URL;
  const tenant = env.BYD_TENANT;
  const username = env.SOAP_ID;
  const password = env.SOAP_PASSWORD;

  const idNpw = `${username}:${password}`;
  const Authorization =
    "Basic " +
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64");

  const { supplierInvoiceID } = request.body;
  const transactionDate = kst.format("YYYY-MM-DD");
  draft.response.body = { supplierInvoiceID, transactionDate };

  const payload = fn.getPayload(supplierInvoiceID, transactionDate);
  const builder = new xml2js.Builder();
  let xml;
  try {
    xml = builder.buildObject(payload);
    draft.response.body.reqXml = xml;
  } catch (error) {
    draft.response.body.errorMsg = error.message;
    return;
  }

  const params = {
    tenant,
    hostname,
    port: 443,
    Authorization,
    SOAPAction: env.SOAP_M_SIN_ACTION,
    data: xml,
  };
  // draft.response.body.params = params;
  const postResponse = await postFn(params);
  // draft.response.body.postResponse = postResponse;
  let result;
  try {
    await xml2js.parseString(
      postResponse.postResult.body,
      function (err, result2) {
        if (err) {
          //
        }
        result = result2;
      }
    );
  } catch (error) {
    draft.response.body.parseErrMsg = error.message;
    return;
  }
  draft.response.body.result = result;

  /** xml request */
  async function postFn(params) {
    const requestFn = (opt, reqData) =>
      new Promise((resolve, reject) => {
        const response = { body: [] };
        const req = https.request(opt, function (res) {
          response.statusCode = res.statusCode;
          res.on("data", (data) => response.body.push(data));
          res.on("end", () =>
            resolve({ body: Buffer.concat(response.body).toString() })
          );
          res.on("error", (err) => reject({ err, res }));
        });
        req.on("error", (err) =>
          reject(`problem with request: ${err.message}`)
        );

        req.write(reqData);

        req.end();
      });

    // REQUEST PART
    try {
      const postOpt = getOpt(params, true);
      const postResult = await requestFn(postOpt, params.data);
      return { postResult, postOpt };
    } catch (err) {
      console.log("err:", err);
      return { postFne: err };
    }
  }
};

const getOpt = (params) => {
  const { hostname, tenant, port, Authorization, SOAPAction } = params;
  const method = "POST";
  const path = [
    "/sap/bc/srt/scs/sap/managesupplierinvoicein",
    `sap-vhost=${tenant}.sapbydesign.com`,
  ].join("?");
  const opt = {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Content-Length": Buffer.byteLength(params.data),
      Authorization,
      SOAPAction,
    },
    hostname,
    port,
    path,
    method,
  };
  return opt;
};
