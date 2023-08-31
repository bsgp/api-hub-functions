module.exports = async (draft, { file }) => {
  const rmPath = draft.json.rmPath;
  const divideNum = draft.json.divideNum;
  const fileData = draft.json.fileData;
  const fileNames = fileData
    // .map((item) =>
    //   item.replace(/soCreateResult\/|so_failed\/|so\/|\.json.*/g, "")
    // )
    .sort((a1, b2) => {
      const aID = a1
        .replace(new RegExp(rmPath, "g"), "")
        .replace(/soCreateResult\/|so_failed\/|so\/|\.json.*/g, "");
      const bID = b2
        .replace(new RegExp(rmPath, "g"), "")
        .replace(/soCreateResult\/|so_failed\/|so\/|\.json.*/g, "");
      return Number(aID) - Number(bID);
    });

  for (
    let idx = 0;
    divideNum
      ? idx <= fileNames.length / divideNum
      : idx <= fileNames.length / 2;
    idx++
  ) {
    await file.move(fileNames[idx], `/past/created.json`);
  }
  const newFileData = await file.list(rmPath);
  const newCount = newFileData.length;

  draft.response.body = { newCount, newFileData };
};
