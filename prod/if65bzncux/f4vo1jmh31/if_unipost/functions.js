module.exports.getSecretKey = async ({ restApi, tryit }) => {
  const result = await restApi.post({
    url: ["https://contdev.unipost.co.kr/unicloud/cont/api/getSecretKey"].join(
      "?"
    ),
    headers: {
      clientKey: "51147370C5A742709F3EB95213CFBE30",
    },
  });

  const secretKey = tryit(() => result.body.response.secretKey);
  if (secretKey) {
    return secretKey;
  }

  const err = new Error("Failed to get secret key from unipost");

  err.description = tryit(
    () => "JSON.stringify(result);\n" + JSON.stringify(result)
  );

  throw err;
};

const getToken = async (secretKey, usId, { restApi, tryit }) => {
  const result = await restApi.post({
    url: [
      "https://contdev.unipost.co.kr/unicloud/cont/api/getContUserToken",
    ].join("?"),
    headers: {
      "content-type": "application/json;charset=UTF-8",
      secretKey,
    },
    body: {
      usId,
    },
  });

  const token = tryit(() => result.body.response.token);
  if (token) {
    return token;
  }

  const err = new Error("Failed to get token from unipost");

  err.description = tryit(
    () => "JSON.stringify(result);\n" + JSON.stringify(result)
  );

  throw err;
};

module.exports.getTokenForWork = async (secretKey, { restApi, tryit }) => {
  const result = await getToken(secretKey, "bsg_cont_work01", {
    restApi,
    tryit,
  });
  return result;
};

module.exports.getTokenForRead = async (secretKey, { restApi, tryit }) => {
  const result = await getToken(secretKey, "bsg_cont_read01", {
    restApi,
    tryit,
  });
  return result;
};
