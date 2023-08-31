module.exports = async (draft, { odata }) => {
  const https = require("https");
  const TargetCustomer = draft.pipe.json.targetCustomer;
  const isTest = draft.pipe.json.isTest;
  const originOrderArr = draft.pipe.json.SalesOrderArr;
  const port = 443;
  const username = "cfo";
  const password = isTest ? "QWEasd12" : "Lguklghq2022";
  const idNpw = `${username}:${password}`;
  const Authorization = [
    "Basic",
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64"),
  ].join(" ");

  const hostname = isTest
    ? "my356725.sapbydesign.com"
    : "my357084.sapbydesign.com";

  const reportNum = "RPZFB0E99AA3B329041AA01EF";

  const queryStr = [
    `$select=CBP_UUID,CGLN_ID`,
    `$filter=(CGLN_ID%20eq%20%27#glnCode#%27)`,
    `$format=json`,
  ].join("&");

  const tmpurl = [
    `https://${hostname}`,
    `/sap/byd/odata/ana_businessanalytics_analytics.svc`,
    `/${reportNum}QueryResults?`,
    queryStr,
  ].join("");

  const options = {
    hostname,
    port,
    path: "/sap/byd/odata/cust/v1/bsg_edi_log/",
    method: "GET",
    headers: { Authorization, "X-CSRF-Token": "Fetch" },
  };

  // 청구처가 TargetCustomer에 있는 값만 처리한다. gnl 코드 기준
  const orderArr = [];
  originOrderArr.forEach((order) => {
    const isTarget = TargetCustomer.includes(
      order.SalesOrder.AccountParty.PartyID
    );
    if (isTarget) {
      orderArr.push(order);
    } else order.isComplete = false;
  });

  let glnCode;
  // byd log 기록용 파마리터
  let errorCustomerOrderNumber = "";
  let errorStandardNumber = "";
  let errorDescription = "";
  let errorCustomerName = "";
  let token;
  let postData;
  let cookie;
  let optionsP;

  if (orderArr.length > 0) {
    const glnCodes = [];
    orderArr.forEach((order) => {
      const accountParty = order.SalesOrder.AccountParty.PartyID;
      const recipient = order.SalesOrder.ProductRecipientParty.PartyID;
      glnCodes.push(accountParty, recipient);
    });
    const url = tmpurl.replace(
      /#glnCode#/g,
      glnCodes.join("%27%20or%20CGLN_ID%20eq%20%27")
    );
    const getCustormer = await odata.get({ url, username, password });
    const customers = getCustormer.d.results;
    const getAccountCode = (glnCode) => {
      return customers.find((party) => party.CGLN_ID === glnCode);
    };
    // draft.response.body.push(customers);

    for (let orderIdx = 0; orderIdx < orderArr.length; orderIdx++) {
      // 청구처 조회
      const currOrder = orderArr[orderIdx].SalesOrder;
      glnCode = currOrder.AccountParty.PartyID;
      const accountParty = getAccountCode(glnCode);
      draft.response.body.push(accountParty);
      if (!accountParty) {
        draft.pipe.json.isComplete[orderIdx] = false;
        orderArr[orderIdx].isComplete = false;
        errorStandardNumber = glnCode;
        errorCustomerName = draft.pipe.json.CustomerName[orderIdx];
        errorCustomerOrderNumber = currOrder.BuyerID;
        errorDescription = [
          " Unknown GLN code.",
          "Enter the GLN code in the Account(Customer) master. ",
        ].join(" ");

        setPostData();

        await req_call(); // 토큰 얻고 post

        continue;
      } else {
        currOrder.AccountParty.PartyID = accountParty.CBP_UUID;
        currOrder.BillToParty.PartyID = accountParty.CBP_UUID;
      }

      glnCode = currOrder.ProductRecipientParty.PartyID;

      const recipientParty = getAccountCode(glnCode);
      // draft.response.body.push(recipientParty);

      if (!recipientParty) {
        draft.pipe.json.isComplete[orderIdx] = false;
        orderArr[orderIdx].isComplete = false;
        // draft.response.body.push({ error: "no recipientParty", url });
        errorStandardNumber = glnCode;
        errorCustomerName = draft.pipe.json.ShiptoName[orderIdx];
        errorDescription = [
          " Unknown GLN code.",
          "Enter the GLN code in the Account(Customer) master for Ship To. ",
        ].join(" ");
        errorCustomerOrderNumber = currOrder.BuyerID;

        setPostData();

        await req_call(); // 토큰 얻고 post
        continue;
      } else {
        currOrder.ProductRecipientParty.PartyID = recipientParty.CBP_UUID;
      }
    }
    // draft.response.body.push(orderArr);
  }
  function getPromise(opt) {
    return new Promise(function (resolve, reject) {
      const req = https.request(opt, function (res) {
        if (opt.method === "GET") {
          token = res.headers["x-csrf-token"];
          cookie = res.headers["set-cookie"];
          optionsP = {
            hostname,
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
          resolve(body);
        });

        res.on("error", function (err) {
          reject(err);
        });
      });

      req.on("error", (err) => {
        console.error(`problem with request: ${err.message}`);
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
    } catch (err) {
      draft.response.body.push({ req_callee: err });
    }
  }

  // draft.response.body.push(postData);

  async function req_call2() {
    try {
      await getPromise(optionsP);
    } catch (err) {
      draft.response.body.push({ req_call2: err });
    }
  }

  function paddingZero(str, SpadCnt) {
    const strArr = str.split(".");
    str = strArr[0].padStart(SpadCnt, "0");
    return str;
  }

  function setPostData() {
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
  }

  draft.pipe.json.token = token;
  draft.pipe.json.cookie = cookie;
};
