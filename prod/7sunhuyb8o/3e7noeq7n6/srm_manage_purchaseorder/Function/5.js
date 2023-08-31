module.exports = async (draft, { file }) => {
  const resultUploadKey = draft.json.resultUploadKey;
  if (resultUploadKey) {
    await file.upload(resultUploadKey, {
      E_STATUS: "S",
      E_MESSAGE: "구매오더 항목 업데이트가 완료되었습니다",
      ...draft.response.body,
    });
  }
};
