module.exports = async (draft, { lib, file }) => {
  const https = require("https");
  const { tryit, defined } = lib;
  const GENs = draft.json.GENs;
  const getNode = (node = {}, def = {}) =>
    defined(
      tryit(() => node, def),
      def
    );

  const paddingZero = (str, SpadCnt) => {
    const splitStr = str.split(".");
    str = splitStr[0].padStart(SpadCnt, "0");
    return str;
  };
  const nowDateTime = new Date();
  const year = nowDateTime.getFullYear().toString();
  const month = paddingZero((nowDateTime.getMonth() + 1).toString(), 2, 0);
  const date = paddingZero(nowDateTime.getDate().toString(), 2, 0);
  const debitNoteList = [];
  for (let idx = 0; idx < GENs.length; idx++) {
    const debit = GENs[idx];
    try {
      const TRANSMISSION = getNode(debit.SAPGENRAL.TRANSMISSION, {});
      const FILE_HEADER = getNode(debit.SAPGENRAL.FILE_HEADER, {});
      const GenTxt = getNode(debit.SAPGENRAL.MSG_GROUP.MSG_DETAIL.GenTxt, []);
      const newObj = {
        InterchangeCtrlNbr: TRANSMISSION.InterchangeCtrlNbr,
        SenderID: TRANSMISSION.SenderID,
        SenderNM: TRANSMISSION.SenderNM,
        TransDate: TRANSMISSION.TransDate,
        TransTime: TRANSMISSION.TransTime,
        TxType: FILE_HEADER.TxType,
        FileCreateDate: FILE_HEADER.FileCreateDate,
      };
      GenTxt.map((txt, idx) => (newObj[`GenTxt${idx + 1}`] = txt));

      const params = {
        hostname: draft.pipe.json.hostname,
        port: 443,
        Authorization: draft.pipe.json.authorization,
        data: JSON.stringify(newObj),
      };
      await getNPatchFn(params);
      const fullPath = debit.filepath;
      const fileName = fullPath.substr(
        fullPath.lastIndexOf("/") + 1,
        fullPath.length
      );
      await file.move(
        fullPath,
        `/custom/GEN_FROM_OpenText_done/${year}/${month}/${date}/` + fileName
      );
      debitNoteList.push(newObj);
    } catch (error) {
      return catchFn(error.message);
    }
  }
  draft.response.body.debitNoteList = debitNoteList;

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
      const dPath = "/sap/byd/odata/cust/v1/bsg_debit_note/";
      const patchPath = "DebitNoteCollection";
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

  async function catchFn(data, path = "/sendGenError/") {
    const now = new Date().toISOString();
    const payloadString = JSON.stringify(data);
    const buf = Buffer.from(payloadString, "utf8").toString();
    await file.upload(path + now, buf, { gzip: true });
  }
};
