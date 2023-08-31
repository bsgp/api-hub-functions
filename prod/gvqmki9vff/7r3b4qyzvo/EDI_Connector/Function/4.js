module.exports = async (draft, { file }) => {
  draft.response.body = [];
  // 처리되지 않은 파일들 내용 확인
  await file
    // .get("custom/FROM_OpenText_test/ord_5010011900016_20210817100551.xml", {
    .get("/send/opentext/lghhuk/regtime.txt", {
      gziped: true,
    })
    .then((txt) => {
      draft.response.body.push(txt);
      return txt;
    })
    .catch((err) => {
      draft.response.body.push(err);
    });
};
