module.exports = async (draft, { file }) => {
  const rmPath = draft.json.rmPath;
  const divideNum = draft.json.divideNum;
  const fileData = draft.json.fileData;
  const fileNames = fileData
    // .map((item) =>
    //   item.replace(/soCreateResult\/|so_failed\/|so\/|\.json.*/g, "")
    // )
    .filter((item) => !item.includes("/2022/") && !item.includes("/2023/"))
    .sort((a1, b2) => {
      const aID = a1.replace(new RegExp(rmPath, "g"), "").replace(/T.*/g, "");
      const bID = b2.replace(new RegExp(rmPath, "g"), "").replace(/T.*/g, "");
      return Number(aID) - Number(bID);
    });

  for (
    let idx = 0;
    divideNum
      ? idx <= fileNames.length / divideNum
      : idx <= fileNames.length / 2;
    idx++
  ) {
    const created = fileNames[idx]
      .replace(new RegExp(rmPath, "g"), "")
      .replace(/T.*/g, "");
    const newPath = created
      .split("-")
      .concat(fileNames[idx].replace(new RegExp(rmPath, "g"), ""))
      .join("/");
    await file.move(fileNames[idx], `${rmPath}${newPath}`);
  }
  // const newFileData = await file.list(rmPath);
  // const newCount = newFileData.length;

  draft.response.body = {
    // fileData,
    fileNames,
    // newCount,
    // newFileData,
  };
};
