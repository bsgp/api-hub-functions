module.exports = async (draft, { env }) => {
  const https = require("https");
  const { list } = draft.json.params;
  const hostname = env.BYD_URL.replace(/https:\/\//, "");
  const idNpw = `${env.BYD_ID}:${env.BYD_PASSWORD}`;
  const Authorization =
    "Basic " +
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64");
  try {
    const df_params = { hostname, port: 443, Authorization };
    const changed = [];
    const patchResults = [];
    for (let idx = 0; idx < list.length; idx++) {
      const { objectID, ...item } = list[idx];
      /** DELIVERY_CLOSE_KUT 납품종료 */
      const data = JSON.stringify({
        ObjectID: objectID,
        DELIVERY_CLOSE_KUT: true,
      });
      const params = { ...df_params, objectID, data };

      const getNPatchFnRes = await getNPatchFn(params);
      const patchResult = getNPatchFnRes.patchResult;
      const resultStautsCode = patchResult.statusCode;

      changed.push({ objectID, ...item });
      patchResults.push({
        getNPatchFnRes,
        E_STATUS:
          resultStautsCode === 201 || resultStautsCode === 204 ? "S" : "F",
        E_MESSAGE:
          resultStautsCode === 201 || resultStautsCode === 204
            ? "Updated Successfully"
            : ["Error occurred"].filter(Boolean).join(": "), // , errorMsg
      });
    }

    const F_Result = patchResults.find((res) => res.E_STATUS === "F");
    if (!F_Result) {
      draft.response.body.changed = changed;
    }
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: F_Result ? "F" : "S",
      E_MESSAGE: F_Result
        ? "납품종료 처리 업데이트에\n실패했습니다"
        : "납품종료 처리가\n완료되었습니다",
      patchResults,
    };
  } catch (error) {
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "F",
      E_MESSAGE: error.message,
    };
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
      const dPath = "/sap/byd/odata/cust/v1/bsg_inbounddeliveryrequest/";
      const patchPath = `InboundDeliveryItemCollection('${params.objectID}')`;
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
