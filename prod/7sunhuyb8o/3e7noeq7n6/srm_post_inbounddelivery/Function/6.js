module.exports = async (draft, { file }) => {
  const resultUploadKey = draft.json.resultUploadKey;
  if (resultUploadKey) {
    await file.upload(resultUploadKey, {
      E_STATUS: "S",
      E_MESSAGE: [
        "납품서 생성이",
        "완료되었습니다.",
        "생성된 납품서를",
        "불러오는중...",
      ].join("\n"),
      ...draft.response.body,
    });
  }
};
