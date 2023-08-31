module.exports = async (draft, { file }) => {
  const resultUploadKey = draft.json.resultUploadKey;
  if (resultUploadKey) {
    await file.upload(resultUploadKey, {
      E_STATUS: "S",
      E_MESSAGE: "종료 처리되었습니다",
      ...draft.response.body,
    });
  }
};
