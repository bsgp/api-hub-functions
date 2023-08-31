module.exports = async (draft, { env }) => {
  const https = require("https");
  const { list } = draft.json.params;
  try {
    const originIDN = draft.json.originIDN;
    const originItemList = originIDN.InboundDeliveryItem || [];
    const patchResults = [];
    for (const originItem of originItemList) {
      const originQtyObj = originItem.InboundDeliveryDeliveryQuantity;
      const ObjectID = originQtyObj.ObjectID;
      const fItem = list.find((item) => item.deliveryQtyUUID === ObjectID);
      if (
        fItem &&
        Number(fItem.deliveryQty) === Number(originQtyObj.Quantity)
      ) {
        continue;
      } else {
        const idNpw = `${env.BYD_ID}:${env.BYD_PASSWORD}`;
        const authorization =
          "Basic " +
          new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64");
        const params = {
          hostname: env.BYD_URL.replace(/https:\/\//, ""),
          port: 443,
          Authorization: authorization,
          ObjectID,
          data: JSON.stringify({ ObjectID, Quantity: `${fItem.deliveryQty}` }),
        };
        const getNPatchFnRes = await getNPatchFn(params);
        const patchResult = getNPatchFnRes.patchResult || {};
        const resultStautsCode = patchResult.statusCode;
        patchResults.push({ getNPatchFnRes, resultStautsCode });
      }
    }
    if (patchResults.length === 0) {
      draft.response.body = {
        ...draft.response.body,
        idnID: originIDN.ID,
        E_STATUS: "F",
        E_MESSAGE: "납품통지 변경내역이\n 없습니다",
      };
    } else {
      draft.response.body = {
        ...draft.response.body,
        idnID: originIDN.ID,
        E_MESSAGE:
          "납품통지 항목이\n업데이트 되었습니다\n업데이트 된 정보를\n가져옵니다\n잠시만 기다려주세요",
      };
    }
  } catch (error) {
    draft.response.body = {
      ...draft.response.body,
      errorMessage: error.message,
      E_STATUS: "F",
      E_MESSAGE: "납품통지 항목\n업데이트에 문제가\n발생했습니다",
    };
  }

  /** HTTP_Request(GET, PATCH): innerFn: requestFn, getOpt */
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
      const patchPath = [
        `InboundDeliveryDeliveryQuantityCollection('${params.ObjectID}')`,
      ].join("");
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
    /** REQUEST PART */
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
