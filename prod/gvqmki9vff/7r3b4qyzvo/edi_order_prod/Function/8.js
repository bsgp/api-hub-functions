module.exports = async (draft, { soap, file, lib }) => {
  const https = require("https");
  const { tryit } = lib;
  let wsdlAlias;
  let certAlias;
  let tenantID;
  if (draft.pipe.json.isTest) {
    wsdlAlias = "test13";
    certAlias = "test10";
    tenantID = "my356725";
  } else {
    wsdlAlias = "prod7";
    certAlias = "prod2";
    tenantID = "my357084";
  }
  const SalesOrderArr = draft.pipe.json.SalesOrderArr;
  const FullPathList = draft.pipe.json.fullPathList;
  const Mpayload = { BasicMessageHeader: {}, SalesOrder: [] };

  // 파일에서 오더가 여러건인 경우 한건이라도 isComplete=false이면 오더 생성x, 파일이동 x
  const isFalsePath = [];
  const sendLogData = [];
  for (let orderIdx = 0; orderIdx < SalesOrderArr.length; orderIdx++) {
    const currOrderData = SalesOrderArr[orderIdx];
    if (currOrderData.isComplete === false) {
      isFalsePath.push(currOrderData.fullPath);
      sendLogData.push(currOrderData);
    } else {
      const SalesOrder = currOrderData.SalesOrder;
      Mpayload.SalesOrder.push(SalesOrder);
    }
  }
  draft.response.body.push({ Mpayload });
  let salesOrderRes;
  if (Mpayload.SalesOrder.length > 0) {
    try {
      salesOrderRes = await soap(`manage_sales_orders:${wsdlAlias}`, {
        p12ID: `lghhuktest:${certAlias}`,
        tenantID,
        operation: "MaintainBundle",
        payload: Mpayload,
      });

      draft.response.body.push({ salesOrderRes });

      if (salesOrderRes.statusCode === 200) {
        const rBody = JSON.parse(salesOrderRes.body);
        const sCode = tryit(() => rBody.Log.MaximumLogItemSeverityCode, "");
        if (sCode === "3") {
          await catchFn(rBody);
        } else {
          await catchFn(rBody, "/soCreateData/");
          for (let fileIdx = 0; fileIdx < FullPathList.length; fileIdx++) {
            const currFile = FullPathList[fileIdx];
            if (!isFalsePath.includes(currFile)) {
              const fullfilepath = draft.pipe.json.fullPathList[fileIdx];
              const fileName = fullfilepath.substr(
                fullfilepath.lastIndexOf("/") + 1,
                fullfilepath.length
              );
              const filePathArr = fullfilepath.split("_");
              const fileDate = filePathArr[filePathArr.length - 1];
              const year = fileDate.substr(0, 4);
              const month = fileDate.substr(4, 2);
              const date = fileDate.substr(6, 2);
              await file.move(
                fullfilepath,
                `/custom/FROM_OpenText_done/${year}/${month}/${date}/` +
                  fileName
              );
              draft.response.body.push(fullfilepath + " is Done");
            }
          }
        }
      } else throw new Error("create salesorder failed");
    } catch (error) {
      return catchFn(Mpayload);
    }
  }

  if (sendLogData.length > 0) {
    const paddingZero = (str, SpadCnt) => {
      const splitStr = str.split(".");
      str = splitStr[0].padStart(SpadCnt, "0");
      return str;
    };
    for (let idx = 0; idx < sendLogData.length; idx++) {
      const currLog = sendLogData[idx];
      const CustomerName = currLog.sender;
      const StandardNumber =
        currLog.errorCode.length > 1
          ? "Check Description"
          : currLog.errorCode[0];
      const desc = currLog.errorDescription.join(", ");
      const refIDs = currLog.refIDs;
      const CustomerOrderNumber = refIDs.join(", ");
      const refDesc = `Failed Order: ${refIDs.join(" & ")}`;
      const Description = `${desc}. ${refDesc}`;

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
          CustomerOrderNumber,
          ExecutionDate: ISOnowtime,
          StandardNumber,
          CustomerName,
          Description,
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

  async function catchFn(data, path = "/sendError/") {
    const now = new Date().toISOString();
    const payloadString = JSON.stringify(data);
    const buf = Buffer.from(payloadString, "utf8").toString();
    await file.upload(path + now, buf, { gzip: true });
  }
};
