module.exports = async (draft, { odata }) => {
  const https = require("https");

  const orderArr = draft.pipe.json.SalesOrderArr;
  const EANs = draft.pipe.json.EAN;
  // byd log 기록용 파마리터
  let errorCustomerOrderNumber = "";
  let errorStandardNumber = "";
  let errorDescription = "";
  let errorCustomerName = "";
  let token = draft.pipe.json.token;
  let cookie = draft.pipe.json.cookie;

  const isTest = draft.pipe.json.isTest;

  const hostname = isTest
    ? "my356725.sapbydesign.com"
    : "my357084.sapbydesign.com";
  const username = "cfo";
  const password = isTest ? "QWEasd12" : "Lguklghq2022";
  const port = 443;
  const idNpw = `${username}:${password}`;
  const Authorization =
    "Basic " +
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64");

  const options = {
    hostname,
    port,
    path: "/sap/byd/odata/cust/v1/bsg_edi_log/",
    method: "GET",
    headers: { Authorization, "X-CSRF-Token": "Fetch" },
  };

  const checkEAN = (productID) => {
    // 존재하지 않는 EAN code 샘플 데이터 테스트용
    if (isTest) {
      if (productID === "1234567890120") {
        return "1234567890128";
        // }else if(productID == '8000000000000'){
        //     EANcode = '8000000000026';
      } else if (productID === "1234567890450") {
        return "8000000000019";
      } else if (productID === "5015015015013") {
        return "5015015015029";
      } else return productID;
    } else return productID;
  };

  const reportNum = "RPZ41348B656183854B13B242";

  let material = [];
  for (let idx = 0; idx < EANs.length; idx = idx + 15) {
    const slice = EANs.slice(idx, idx + 15);
    const filter = slice.map((productID) => {
      return `CGTIN eq '${checkEAN(productID)}'`;
    });
    const queryStr = [
      `$select=CQUANTITY_TYPE_CODE,CGTIN,CMATR_INT_ID,TMATR_INT_ID`,
      `$filter=(${filter.join(" or ")})`,
      `$format=json`,
    ].join("&");
    const url = [
      `https://${hostname}`,
      `/sap/byd/odata/ana_businessanalytics_analytics.svc`,
      `/${reportNum}QueryResults?`,
      queryStr,
    ].join("");
    draft.response.body.push({ url });
    const getMaterial = await odata.get({ url, username, password });
    material = material.concat(getMaterial.d.results);
  }
  draft.response.body.push(material);
  let postData;
  let optionsP;

  for (let orderIdx = 0; orderIdx < orderArr.length; orderIdx++) {
    if (!orderArr[orderIdx].isComplete) {
      continue;
    }
    for (
      let itemIdx = 0;
      itemIdx < orderArr[orderIdx].SalesOrder.Item.length;
      itemIdx++
    ) {
      const orderItem = orderArr[orderIdx].SalesOrder.Item[itemIdx];
      const itemProduct = orderItem.ItemProduct;
      const EANcode = checkEAN(itemProduct.ProductInternalID);
      const productInfo = material.find((item) => item.CGTIN === EANcode);

      if (!productInfo) {
        draft.pipe.json.isComplete[orderIdx] = false;
        orderArr[orderIdx].isComplete = false;
        errorStandardNumber = EANcode;
        errorCustomerName = draft.pipe.json.CustomerName[orderIdx];
        errorDescription = [
          " Unknown EANcode code.",
          "Enter the EANcode code in the Material master. ",
        ].join(" ");
        draft.response.body.push({ error: "no ProductInfo", EANcode });
        errorCustomerOrderNumber = orderArr[orderIdx].SalesOrder.BuyerID;

        const nowDateTime = new Date();
        const ymd =
          nowDateTime.getFullYear().toString() +
          paddingZero((nowDateTime.getMonth() + 1).toString(), 2, 0) +
          paddingZero(nowDateTime.getDate().toString(), 2, 0);
        const ymdhms =
          ymd +
          paddingZero(nowDateTime.getHours().toString(), 2, 0) +
          paddingZero(nowDateTime.getMinutes().toString(), 2, 0) +
          nowDateTime.getSeconds().toString();
        const ISOnowtime = new Date(nowDateTime).toISOString();

        postData = JSON.stringify({
          ID: ymdhms,
          CustomerOrderNumber: errorCustomerOrderNumber,
          ExecutionDate: ISOnowtime,
          StandardNumber: errorStandardNumber,
          CustomerName: errorCustomerName,
          Description: errorDescription,
        }).toString();

        await req_call(); // 토큰 얻고 post

        continue;
      }
      if (productInfo.CQUANTITY_TYPE_CODE !== "EA") {
        draft.pipe.json.ProductIDs.push(productInfo.CMATR_INT_ID);
      }
      itemProduct.ProductInternalID = productInfo.CMATR_INT_ID;
      itemProduct.UnitOfMeasure = productInfo.CQUANTITY_TYPE_CODE;
      orderItem.EXT008 = productInfo.CQUANTITY_TYPE_CODE;
    }
  }

  draft.pipe.json.SalesOrderArr = orderArr;

  function getPromise(opt) {
    return new Promise(function (resolve, reject) {
      const req = https.request(opt, function (res) {
        if (opt.method === "GET") {
          token = res.headers["x-csrf-token"];
          cookie = res.headers["set-cookie"];
          optionsP = {
            hostname: hostname,
            port,
            path: "/sap/byd/odata/cust/v1/bsg_edi_log/EDIErrorLogCollection",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(postData),
              Authorization,
              "X-CSRF-Token": token,
              Cookie: cookie,
            },
          };
        }
        let body = "";

        res.on("data", function (data) {
          body += data.toString();
        });

        res.on("end", function () {
          // draft.response.body.push({'응답값' :body});
          resolve(body);
        });

        res.on("error", function (error) {
          draft.response.body.push({ "자재변환 에러 로그 시도 실패": error });
          reject(error);
        });
      });

      req.on("error", (error) => {
        draft.response.body.push({ "자재변환 에러 로그 시도 실패2": error });
      });

      // Write data to request body
      if (req.method === "POST") {
        req.write(postData);
      }
      req.end();
    });
  }

  async function req_call() {
    try {
      await getPromise(options);

      await req_call2();
    } catch (error) {
      draft.response.body.push({ 자재req_callee: error });
    }
  }

  async function req_call2() {
    try {
      await getPromise(optionsP);
    } catch (error) {
      draft.response.body.push({ req_call2ee: error });
    }
  }

  function paddingZero(str, SpadCnt) {
    const splitStr = str.split(".");
    str = splitStr[0].padStart(SpadCnt, "0");
    return str;
  }
};
