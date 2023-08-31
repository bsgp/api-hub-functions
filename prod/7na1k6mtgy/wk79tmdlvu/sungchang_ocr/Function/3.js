module.exports = async (draft, { request, file, tryit }) => {
  const http = require("http");
  const {
    body,
    // , ...args
  } = request;
  const params = {
    hostname: "3.35.201.76",
    "Content-Type": request.headers["Content-Type"],
    "Content-Length": request.headers["Content-Length"],
    data: body,
  };
  const postResponse = await postFn(params);
  const parsingData = tryit(() => JSON.parse(postResponse.postResult.body), []);
  draft.response.body = parsingData;

  await file.upload("/sunchang_poc/result", {
    postResponse,
    E_STATUS: "S",
    E_MESSAGE: "",
    request,
  });

  async function postFn(params) {
    const requestFn = (opt, reqData) =>
      new Promise((resolve, reject) => {
        const response = { body: [] };
        const req = http.request(opt, function (res) {
          response.statusCode = res.statusCode;
          res.on("data", (data) => response.body.push(data));
          res.on("end", () =>
            resolve({ body: Buffer.concat(response.body).toString() })
          );
          res.on("error", (err) => reject({ err, res }));
        });
        req.on("error", (err) =>
          reject(`problem with request: ${err.message}`)
        );

        req.write(reqData);

        req.end();
      });

    // REQUEST PART
    try {
      const postOpt = getOpt(params, true);
      const postResult = await requestFn(postOpt, params.data);
      return { postResult, postOpt };
    } catch (err) {
      console.log("err:", err);
      return { postFne: err };
    }
  }
};

const getOpt = (params) => {
  const { hostname } = params;
  const port = "1880";
  const method = "POST";
  const path = "/v1/sc/upload/s3";
  const opt = {
    headers: {
      // Accept: "*/*",
      // "Accept-Encoding": "gzip, deflate, br",
      // Connection: "keep-alive",
      "Content-Type": params["Content-Type"],
      "Content-Length": Buffer.byteLength(params.data),
    },
    hostname,
    port,
    path,
    method,
  };
  return opt;
};
