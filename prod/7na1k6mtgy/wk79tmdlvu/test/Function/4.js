module.exports = async (draft) => {
  const https = require("https");
  const port = 443;
  const username = "CFO";
  const password = "Lguklghq20221";
  const idNpw = `${username}:${password}`;
  const Authorization = [
    "Basic",
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64"),
  ].join(" ");

  const hostname = "my356725.sapbydesign.com";

  const options = {
    hostname,
    port,
    path: "/sap/byd/odata/cust/v1/bsg_edi_log/",
    method: "GET",
    headers: { Authorization, "X-CSRF-Token": "Fetch" },
  };

  // byd log 기록용 파마리터

  let token;
  let postData;
  let cookie;
  let optionsP;

  setPostData();

  await req_call(); // 토큰 얻고 post

  draft.response.body = {
    result: "send",
    postData,
  };

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

  function setPostData() {
    postData = JSON.stringify({
      ID: "1998051200012",
      CustomerOrderNumber: "PO_9650858971",
      ExecutionDate: new Date().toISOString(),
      StandardNumber: "38801051111867",
      CustomerName: "ASDA STORES LTD",
      Description:
        "Unknown GLN code.Enter the GLN code in the Account(Customer) master.",
    }).toString();
  }
};
