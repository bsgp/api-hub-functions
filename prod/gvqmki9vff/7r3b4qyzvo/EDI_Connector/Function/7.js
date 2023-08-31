module.exports = async (draft, { file }) => {
  // 처리되지 않은 파일들 내용 확인
  for (let i = 0; i < draft.pipe.json.files.length; i++) {
    await file
      .get(draft.pipe.json.files[i], { gziped: true })
      .then((txt) => {
        draft.response.body.push(txt);
        return txt;
      })
      .catch((err) => {
        draft.response.body.push(err);
      });
  }
};
