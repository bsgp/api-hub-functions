module.exports = async (draft, { file }) => {
  const filePath = draft.json.filePath;
  try {
    const data = await file.get(filePath);
    draft.response.body = JSON.parse(data);
  } catch (error) {
    draft.response.body = {
      filePath,
      E_STATUS: "F",
      E_MESSAGE: error.message,
    };
  }
};
