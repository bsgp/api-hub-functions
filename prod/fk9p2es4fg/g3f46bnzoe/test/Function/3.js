module.exports = async (draft, { file }) => {
  const rmPath = draft.json.rmPath;
  const fileData = await file.list(rmPath);
  if (fileData.length > 0) {
    draft.json.fileData = fileData;
    const count = fileData.length;
    draft.response.body = { count, fileData };
    draft.json.nextNodeKey = "Function#4";
    // draft.json.nextNodeKey = "Output#2";
  } else {
    draft.json.nextNodeKey = "Output#2";
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: "No File Exist.",
    };
  }
};
