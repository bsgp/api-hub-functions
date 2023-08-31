module.exports = async (draft, { env }) => {
  /**
   * 생성된 입하 통지의 납품통지 상태 변경(IDN_ObjectID)
   * 기존 입하통지를 취소 처리(originIDN_ObjectID)
   */
  const https = require("https");
  const hostname = env.BYD_URL.replace(/https:\/\//, "");
  const idNpw = `${env.BYD_ID}:${env.BYD_PASSWORD}`;
  const Authorization =
    "Basic " +
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64");

  const E_MESSAGE = [];
  try {
    // 생성된 입하 통지의 납품통지 상태 변경(IDN_ObjectID)
    const objectID = draft.json.IDN_ObjectID;
    const params = {
      hostname,
      port: 443,
      Authorization,
      updatePath: `setadvised?ObjectID='${objectID}'`,
      method: "POST",
      data: JSON.stringify({}),
    };
    const postIdnAdvisedAction = await getNPatchFn(params);
    const updateResult = postIdnAdvisedAction.updateResult;
    const resultStautsCode = updateResult.statusCode;
    if (resultStautsCode !== 200) {
      E_MESSAGE.push([
        "납품서 생성이 완료되었으나,",
        "통지상태 변경에",
        "오류가 있습니다",
      ]);
    }
    draft.response.body = {
      ...draft.response.body,
      // E_STATUS: resultStautsCode === 200 ? "S" : "F",
      postIdnAdvisedAction,
    };
  } catch (error) {
    E_MESSAGE.push([
      "납품서 생성이 완료되었으나,",
      "통지상태 변경에",
      "오류가 있습니다",
    ]);
  }
  try {
    // 기존 입하통지를 취소 처리(originIDN_ObjectID)
    const ObjectID = draft.json.originIDN_ObjectID;
    const params = {
      hostname,
      port: 443,
      Authorization,
      updatePath: `InboundDeliveryCollection('${ObjectID}')`,
      method: "PATCH",
      data: JSON.stringify({ ObjectID, CancellationStatusCode: "4" }),
    };
    const patchCancellationAction = await getNPatchFn(params);
    const updateResult = patchCancellationAction.updateResult;
    const resultStautsCode = updateResult.statusCode;
    if (resultStautsCode !== 204) {
      E_MESSAGE.push("기존 납품통지를\n취소하는 과정에서\n오류가 있습니다");
    }
    draft.response.body = {
      ...draft.response.body,
      // E_STATUS: resultStautsCode === 204 ? "S" : "F",
      patchCancellationAction,
    };
  } catch (error) {
    E_MESSAGE.push(["기존 납품통지를", "취소하는 과정에서", "오류가 있습니다"]);
  }
  if (E_MESSAGE.length === 0) {
    const idnID = draft.json.newIDN;
    E_MESSAGE.push(
      `입하 통지 ${idnID}의\n변경 사항을\n성공적으로 저장하였습니다`
    );
  }
  draft.response.body = {
    ...draft.response.body,
    E_MESSAGE: E_MESSAGE.join("\n"),
  };

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

    const getOpt = ({ params = {}, isPATCH = false, isPOST = false }) => {
      const { hostname, port, Authorization, updatePath } = params;
      const method = isPATCH ? "PATCH" : isPOST ? "POST" : "GET";
      const dPath = "/sap/byd/odata/cust/v1/bsg_inbounddeliveryrequest/";
      const path = isPATCH || isPOST ? `${dPath}${updatePath}` : dPath;
      const opt = { headers: { Authorization }, hostname, port, path, method };
      if (isPATCH || isPOST) {
        opt.headers.Cookie = params.cookie;
        opt.headers["Content-Type"] = "application/json";
        opt.headers["Content-Length"] = Buffer.byteLength(params.data);
        opt.headers["X-CSRF-Token"] = params.token;
      } else opt.headers["X-CSRF-Token"] = "Fetch";
      return opt;
    };
    // REQUEST PART
    try {
      const getResult = await requestFn(getOpt({ params }));
      const { token, cookie } = getResult;
      const isPATCH = params.method === "PATCH";
      const isPOST = params.method === "POST";
      const updateOpt = getOpt({
        params: { ...params, token, cookie },
        isPATCH,
        isPOST,
      });
      const updateResult = await requestFn(updateOpt, params.data);
      return { getResult, updateResult };
    } catch (err) {
      return { getNPatchFne: err };
    }
  }
};
