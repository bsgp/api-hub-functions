module.exports = async (draft, { file }) => {
  const resultUploadKey = draft.json.qr_resultUploadKey;
  if (resultUploadKey) {
    await file.upload(resultUploadKey, {
      E_STATUS: "S",
      E_MESSAGE: "조회 완료",
      ...draft.response.body,
      // E_MESSAGE: "조회가 완료되었습니다",
    });
  }
};
