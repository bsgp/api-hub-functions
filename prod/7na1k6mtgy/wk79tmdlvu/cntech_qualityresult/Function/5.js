module.exports = async (draft, { file }) => {
  const tennant = draft.json.tennant;
  const skip = draft.json.skip;
  if (Number(skip) > 74281) {
    return;
  }

  const skipNext = draft.json.skipNext;
  const iStockData = draft.json.iStockData;
  const uploadFileName = `/cntech/${tennant}/backup/${skip}.js`;
  if (iStockData.d.results.length > 0) {
    await file.upload(uploadFileName, iStockData, { gzip: true });
    await file.upload(`/cntech/${tennant}/skip.txt`, skipNext, { gzip: true });
  }
  draft.response.body = {
    ...draft.response.body,
    uploadFileName,
    skipNext,
    tennant,
    dataCount: iStockData.d.results.length,
  };
};
