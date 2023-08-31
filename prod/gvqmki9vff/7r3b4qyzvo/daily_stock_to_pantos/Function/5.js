module.exports = async (draft, { log }) => {
  // restFul 요청
  const https = require("https");
  const postData = draft.pipe.json.stock;
  const username = "LGHH";
  const password = "LGHH";
  const idNpw = username + ":" + password;

  let hostname;
  let port;

  //   const istest = true;

  if (draft.pipe.json.isTest) {
    hostname = "b2bqa.lxpantos.com";
    port = 5409;
  } else {
    hostname = "b2b.lxpantos.com";
    port = 5709;
  }
  draft.response.body.unshift(`url: ${hostname}`);

  const options = {
    hostname,
    port,
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

  function getPromise(opt) {
    return new Promise(function (resolve, reject) {
      const req = https.request(opt, function (res) {
        let body = "";

        res.on("data", function (d) {
          body += d.toString();
        });

        res.on("end", function () {
          draft.response.body.push({ ALLbody: body });
          resolve(body);
        });

        res.on("error", function (e) {
          draft.response.body.push({ error: "e" });
          reject(e);
        });
      });
      // .end();  // .end() req.end() 둘다 가능
      req.on("error", () => {
        draft.response.body.push({ error: "error.message" });
      });
      req.write(postData);
      req.end();
    });
  }

  async function req_call(options) {
    return await getPromise(options);
  }
  try {
    const request = await req_call(options);
    log("fn5: promise", request);
  } catch (error) {
    draft.response.body.push({ error: `error.message` });
  }
  //   draft.response.body.push(postData);
};
