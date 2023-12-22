const checkResError = (body, prefixMessage) => {
  /*{
    "status": "200",
    "message": "통신이 처리 되었습니다.",
    "response": {
        "resultCode": "-1",
        "message": "인증키값이 유효 하지 않습니다."
    }
  }*/
  if (body.response) {
    if (body.response.resultCode === "-1") {
      const err = new Error(
        [prefixMessage, body.response.message].filter(Boolean).join(", ")
      );

      try {
        err.description = "JSON.stringify(body);\n" + JSON.stringify(body);
      } catch (ex) {
        // pass
      }

      throw err;
    }
  }
};

module.exports.getSecretKey = async ({ restApi, unipostURL }) => {
  const result = await restApi.post({
    url: [unipostURL, "/unicloud/cont/api/getSecretKey"].join("/"),
    headers: { clientKey: "51147370C5A742709F3EB95213CFBE30" },
  });

  checkResError(result.body, "Failed to get secret key from unipost");
  console.log("result.body:", result.body);
  return result.body.response.secretKey;
};

const getToken = async (
  secretKey,
  { usId, contNo },
  { restApi, unipostURL }
) => {
  const body = { usId };
  if (contNo) {
    body.contNo = contNo;
  }

  const result = await restApi.post({
    url: [unipostURL, "/unicloud/cont/api/getContUserToken"].join("/"),
    headers: {
      "content-type": "application/json;charset=UTF-8",
      secretKey,
    },
    body,
  });
  checkResError(result.body, "Failed to get token from unipost");

  return result.body.response.token;
};

module.exports.getTokenForWork = async (
  secretKey,
  { contNo, restApi, unipostURL }
) => {
  const result = await getToken(
    secretKey,
    { usId: "bsg_cont_work01", contNo },
    { restApi, unipostURL }
  );
  return result;
};

module.exports.getTokenForRead = async (
  secretKey,
  { contNo, restApi, unipostURL }
) => {
  const result = await getToken(
    secretKey,
    { usId: "bsg_cont_read01", contNo },
    { restApi, unipostURL }
  );
  return result;
};

module.exports.getTemplateList = async (secretKey, { restApi, unipostURL }) => {
  const result = await restApi.post({
    url: [unipostURL, "/unicloud/cont/api/getTemplateList"].join("/"),
    headers: {
      "content-type": "application/json;charset=UTF-8",
      secretKey,
    },
    body: { searchInfo: {} },
  });
  checkResError(result.body, "Failed to get Template list");

  return result.body.response.templateList.list;
};

module.exports.sortIndexFn = (arr = []) =>
  arr.sort((al, be) => Number(al.index) - Number(be.index));
