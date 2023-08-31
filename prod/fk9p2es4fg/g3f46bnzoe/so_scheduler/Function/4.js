module.exports = async (draft, { file }) => {
  const fileNames = draft.json.fileNames;
  for (let idx = 0; idx < fileNames.length; idx++) {
    const fileName = fileNames[idx];
    await file.move(fileName, `/past/created.json`);
  }
  draft.response.body = {
    ...draft.response.body,
    message: "done",
  };
};
