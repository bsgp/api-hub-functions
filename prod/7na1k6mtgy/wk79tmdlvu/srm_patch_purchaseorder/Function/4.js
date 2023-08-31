module.exports = async (draft, { file }) => {
  const https = require("https");
  const { objectID, confirmIndicatior, confirmDate } = draft.json.params;

  const SRM001_KUT = confirmIndicatior;
  const SRM002_KUT = confirmDate ? `${confirmDate}T00:00:00` : undefined;
  const params = {
    hostname: draft.json.hostname,
    port: 443,
    Authorization: draft.json.authorization,
    objectID,
    data: JSON.stringify({ SRM001_KUT, SRM002_KUT }),
  };
  draft.response.body.changed = { objectID, confirmIndicatior, confirmDate };
  const getNPatchFnRes = await getNPatchFn(params);
  const patchResult = getNPatchFnRes.patchResult;

  const resultStautsCode = patchResult.statusCode;
  // let errorMsg;
  // if (resultStautsCode !== 204) {
  //   errorMsg =
  //     patchResult.body &&
  //     patchResult.body
  //       .replace(/^.{0,}<message /, "")
  //       .replace(/xml:lang="ko">/, "")
  //       .replace(/<\/message.{0,}/, "");
  // }
  draft.response.body = {
    ...draft.response.body,
    getNPatchFnRes,
    E_STATUS: resultStautsCode,
    E_MESSAGE:
      resultStautsCode === 204
        ? "Changed Successfully"
        : [
            "Error occurred",
            // , errorMsg
          ]
            .filter(Boolean)
            .join(": "),
  };
  if (draft.json.resultUploadKey) {
    const uploadResult = await file.upload(
      draft.json.resultUploadKey,
      draft.response.body
    );
    draft.response.body = { ...draft.response.body, uploadResult };
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

    const getOpt = (params, isPATCH = false) => {
      const { hostname, port, Authorization } = params;
      const method = isPATCH ? "PATCH" : "GET";
      const dPath = "/sap/byd/odata/cust/v1/bsg_purchaseorder/";
      const patchPath = `POCollection('${params.objectID}')`;
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
