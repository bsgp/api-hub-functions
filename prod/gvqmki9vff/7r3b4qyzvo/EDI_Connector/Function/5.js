module.exports = async (draft, { file }) => {
  draft.response.body = [];

  await file.move(
    "custom/FROM_OpenText/ord_5000167000003_20220307050343.xml",
    "custom/FROM_OpenText_test/ord_5000167000003_20220307050343.xml"
  );

  // await file.move(
  //"custom/FROM_OpenText_done/2021/12/15/ord_5010645000007_20211215190834.xml",
  //   "custom/FROM_OpenText_test/ord_5010645000007_20211215190834.xml"
  // );

  const result = await file.list("/custom/FROM_OpenText/"); //배열로 받아옴
  draft.response.body.push(result);
  const result2 = await file.list("/custom/FROM_OpenText_test/"); //배열로 받아옴
  draft.response.body.push(result2);

  const result3 = await file.list("/custom/FROM_OpenText_done/"); //배열로 받아옴
  draft.response.body.push(result3);
};
