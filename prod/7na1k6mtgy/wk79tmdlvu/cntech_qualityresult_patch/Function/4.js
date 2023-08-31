module.exports = async (draft) => {
  const https = require("https");
  const { changed } = draft.json.fileParse;
  const isExist = draft.json.isExist;
  if (!isExist) {
    return;
  }

  const patchResult = [];
  if (changed.data.length > 0) {
    for (let idx = 0; idx < changed.data.length; idx++) {
      const { ObjectID, QC_REPORT_KUT } = changed.data[idx];
      const params = {
        hostname: draft.json.hostname,
        port: 443,
        Authorization: draft.json.authorization,
        objectID: ObjectID,
        data: JSON.stringify({ QC_REPORT_KUT: JSON.stringify(QC_REPORT_KUT) }),
      };
      draft.response.body[idx] = changed.data[idx];
      const getNPatchFnRes = await getNPatchFn(params);
      patchResult.push({ ...getNPatchFnRes, ObjectID });
    }
  }

  draft.json.patchResult = patchResult;
  draft.response.body = { ...draft.response.body, patchResult };

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

    const getOpt = (params, isPATCH = false) => {
      const { hostname, port, Authorization } = params;
      const method = isPATCH ? "PATCH" : "GET";
      const dPath = "/sap/byd/odata/cust/v1/bsg_istock/";
      const patchPath = `IdentifiedStockCollection('${params.objectID}')`;
      const path = isPATCH ? `${dPath}${patchPath}` : dPath;
      const opt = { headers: { Authorization }, hostname, port, path, method };
      if (isPATCH) {
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
};
