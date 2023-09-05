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
  } else {
    const err = new Error("Failed to get secret key from unipost");
    err.description = tryit(
      () => "JSON.stringify(result);\n" + JSON.stringify(result)
    );
    throw err;
  }
};
