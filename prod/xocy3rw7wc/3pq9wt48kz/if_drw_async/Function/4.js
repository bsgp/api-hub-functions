module.exports = async (draft, { request, file }) => {
  const cacheKey = ["if_cache", request.body.InterfaceId]
    .join("/")
    .concat(".json");
  let cacheData = await file.get(cacheKey, {
    gziped: true,
    toJSON: true,
    doNotThrow: true,
  });
  if (!cacheData) {
    cacheData = {};
  }

  cacheData.Status = "Started";
  cacheData.RequestTime = request.requestTimeUTC || new Date();

  await file.upload(cacheKey, cacheData, { gzip: true });

  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "요청을 접수하였습니다",
  };
  return;
};
