module.exports = async (draft, { lib, request, file }) => {
  const { tryit } = lib;
  const body = tryit(() => request.method === "POST" && request.body, {});
  const path = body.path
    ? `/custom/FROM_OpenText_${body.path}/`
    : "/custom/FROM_OpenText/";

  draft.response.body = [];

  const result = await file.list(path);
  draft.pipe.json.files = result;
  draft.response.body.push({ result });

  //  처리된 내역 조회(array)
  // const result2 = await file.list("/custom/FROM_OpenText_done/"); // 배열로 받아옴
  // draft.response.body.push({ r2: result2 });
  // const result3 = await file.list("/custom/FROM_OpenText_test/"); // 배열로 받아옴
  // draft.response.body.push({ r3: result3 });
  // const result4 = await file.list("/custom/FROM_OpenText_done/2021/");
  // // 배열로 받아옴
  // draft.response.body.push({ r4: result4 });
};
