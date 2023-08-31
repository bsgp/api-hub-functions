module.exports = async (draft, { file }) => {
  const resultUploadKey = draft.json.resultUploadKey;
  try {
    const data = await file.get(resultUploadKey);
    draft.response.body = JSON.parse(data);
  } catch (error) {
    draft.response.body = {
      resultUploadKey,
      E_STATUS: "F",
      E_MESSAGE: error.message,
    };
  }
};
