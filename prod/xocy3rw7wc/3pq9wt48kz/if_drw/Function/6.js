module.exports = async (draft, { file, request }) => {
  const cacheKey = ["if_cache", request.body.InterfaceId]
    .join("/")
    .concat(".json");
  const cacheData = await file.get(cacheKey, {
    toJSON: true,
    doNotThrow: true,
    gziped: true,
  });
  if (!cacheData) {
    return;
  }

  cacheData.Status = "Finished";
  cacheData.EndTime = new Date();

  await file.upload(cacheKey, cacheData, { gzip: true });
};
