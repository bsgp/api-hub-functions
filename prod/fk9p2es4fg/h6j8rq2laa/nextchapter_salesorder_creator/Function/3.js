module.exports = async (draft, { file }) => {
  const fileData = await file.list("so/");
  if (fileData.length > 0) {
    const fileNames = fileData.sort((a1, b2) => {
      const aID = a1.replace(/so\/|\.json/g, "");
      const bID = b2.replace(/so\/|\.json/g, "");
      return Number(aID) - Number(bID);
    });
    const fileName = fileNames[0];
    draft.json.fileName = fileName;
    draft.response.body = { files: fileNames, fileName };
  } else {
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: "No File Exist.",
    };
  }
};
