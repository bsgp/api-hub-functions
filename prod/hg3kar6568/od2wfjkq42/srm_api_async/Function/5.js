module.exports = async (draft, { file }) => {
  const resultUploadKey = draft.json.resultUploadKey;
  try {
    const data = await file.get(resultUploadKey);
    const result = JSON.parse(data) || {};
    draft.response.body = result;
    if (result.E_STATUS && result.E_STATUS !== "S") {
      draft.response.body = { ...result, stopIndicator: true };
    } else draft.response.body = result;
  } catch (error) {
    draft.response.body = {
      resultUploadKey,
      E_STATUS: "F",
      E_MESSAGE: error.message,
    };
  }
};
