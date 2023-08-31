module.exports = async (draft, { file }) => {
  const https = require("https");
  const sendLogData = draft.response.body.hasIssue;
  if (sendLogData.length > 0) {
    const paddingZero = (str, SpadCnt) => {
      const splitStr = str.split(".");
      str = splitStr[0].padStart(SpadCnt, "0");
      return str;
    };
    for (let idx = 0; idx < sendLogData.length; idx++) {
      const currLog = sendLogData[idx];

      const nowDateTime = new Date();
      const year = nowDateTime.getFullYear().toString();
      const month = paddingZero((nowDateTime.getMonth() + 1).toString(), 2, 0);
      const date = paddingZero(nowDateTime.getDate().toString(), 2, 0);
      const ymd = `${year}${month}${date}`;
      const ymdhms =
        ymd +
        paddingZero(nowDateTime.getHours().toString(), 2, 0) +
        paddingZero(nowDateTime.getMinutes().toString(), 2, 0) +
        nowDateTime.getSeconds().toString();
      const ISOnowtime = new Date(nowDateTime).toISOString();
      const params = {
        hostname: draft.pipe.json.hostname,
        port: 443,
        Authorization: draft.pipe.json.authorization,
        data: JSON.stringify({
          ID: ymdhms,
          CustomerOrderNumber: currLog.fileName,
          ExecutionDate: ISOnowtime,
          StandardNumber: "-",
          CustomerName: currLog.customer,
          Description: "system error occurred",
        }),
      };
      try {
        await getNPatchFn(params);
        const fullPath = currLog.fullPath;
        const fileName = fullPath.substr(
          fullPath.lastIndexOf("/") + 1,
          fullPath.length
        );
        await file.move(
          fullPath,
          `/custom/FROM_OpenText_failed/${year}/${month}/${date}/` + fileName
        );
      } catch (error) {
        return catchFn(error.message);
      }
    }
  } else {
    draft.response.body.message = "No Issues";
  }
  // HTTP_Request(GET, PATCH): innerFn: requestFn, getOpt
  async function getNPatchFn(params) {
    const requestFn = (opt, data) =>
      new Promise((resolve, reject) => {
        const response = { body: "" };
        const req = https.request(opt, function (res) {
          if (opt.method === "GET") {
            response.token = res.headers["x-csrf-token"];
            response.cookie = res.headers["set-cookie"];
          }
          response.statusCode = res.statusCode;
          res.on("data", (data) => (response.body += data.toString()));
          res.on("end", () => resolve(response));
          res.on("error", (err) => reject(err));
        });
        req.on("error", (err) =>
          reject(`problem with request: ${err.message}`)
        );
        if (req.method !== "GET") {
          req.write(data);
        }
        req.end();
      });

    const getOpt = (params, isPOST = false) => {
      const { hostname, port, Authorization } = params;
      const method = isPOST ? "POST" : "GET";
      const dPath = "/sap/byd/odata/cust/v1/bsg_edi_log/";
      const patchPath = "EDIErrorLogCollection";
      const path = isPOST ? `${dPath}${patchPath}` : dPath;
      const opt = {
        headers: { Authorization },
        hostname,
        port,
        path,
        method,
      };
      if (isPOST) {
        opt.headers.Cookie = params.cookie;
        opt.headers["Content-Type"] = "application/json";
        opt.headers["Content-Length"] = Buffer.byteLength(params.data);
        opt.headers["X-CSRF-Token"] = params.token;
      } else opt.headers["X-CSRF-Token"] = "Fetch";
      return opt;
    };
    // REQUEST PART
    try {
      const getResult = await requestFn(getOpt(params));
      const { token, cookie } = getResult;
      const patchOpt = getOpt({ ...params, token, cookie }, true);
      const patchResult = await requestFn(patchOpt, params.data);
      return { getResult, patchResult };
    } catch (err) {
      return { getNPatchFne: err };
    }
  }

  async function catchFn(data) {
    const now = new Date().toISOString();
    const payloadString = JSON.stringify(data);
    const buf = Buffer.from(payloadString, "utf8").toString();
    await file.upload("/sendError/" + now, buf, { gzip: true });
  }
};
