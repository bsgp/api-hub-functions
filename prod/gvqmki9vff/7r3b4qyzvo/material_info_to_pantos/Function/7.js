module.exports = async (draft, { file, log }) => {
  // module.exports = async (draft, { log }) => {
  // restFul 요청
  const https = require("https");

  const postData = draft.pipe.json.material;

  const username = "LGHH";
  const password = "LGHH";
  const idNpw = username + ":" + password;

  let hostname;
  let port;

  if (draft.pipe.json.isTest) {
    // hostname = '61.33.252.199';
    hostname = "b2bqa.lxpantos.com";
    port = 5409;
  } else {
    // hostname = '61.33.252.168';
    hostname = "b2b.lxpantos.com";
    port = 5709;
  }

  const options = {
    hostname: hostname,
    port: port,
    path: "/invoke/wm.tn/receive",
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Content-Length": Buffer.byteLength(postData),
      Authorization:
        "Basic " +
        new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64"),
    },
  };

  if (
    draft.pipe.json.material !== "_Empty" &&
    draft.pipe.json.material !== undefined
  ) {
    // draft.response.body.push(postData);
    // draft.response.body.push(typeof(postData));  //string

    await req_call();
    draft.response.body.push(postData);
  } else {
    draft.response.body.push("No material Change");
    draft.response.body.push({ fromtime: draft.pipe.json.fromtime });
    draft.response.body.push({ nowtime: draft.pipe.json.nowtime });
    //성공 시 시간기록
    const buf = Buffer.from(draft.pipe.json.nowtime, "utf8").toString();
    file.upload("/send/material/pantos/regtime.txt", buf, { gzip: true });
  }

  function getPromise(opt) {
    return new Promise(function (resolve, reject) {
      const req = https.request(opt, function (res) {
        let body = "";

        res.on("data", function (d) {
          body += d.toString();
          // draft.response.body.push(body);
        });

        res.on("end", function () {
          draft.response.body.push(body);
          resolve(body);
        });

        res.on("error", function (e) {
          draft.response.body.push({ 1: e });
          reject(e);
        });
      });
      // .end();  // .end() req.end() 둘다 가능
      req.on("error", (e) => {
        draft.response.body.push({ 2: e });
      });

      req.write(postData);
      req.end();
    });
  }

  async function req_call() {
    try {
      const http_promise = await getPromise(options);
      // draft.response.body.push({'프로미스':http_promise.body});
      log({ 프로미스: http_promise.body });
      draft.response.body.push({ fromtime: draft.pipe.json.fromtime });
      draft.response.body.push({ nowtime: draft.pipe.json.nowtime });
      //성공 시 시간기록
      const buf = Buffer.from(draft.pipe.json.nowtime, "utf8").toString();
      file.upload("/send/material/pantos/regtime.txt", buf, { gzip: true });
    } catch (e) {
      draft.response.body.push({ 3: e });
    }
  }
};
