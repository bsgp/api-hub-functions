module.exports = async (draft, { request }) => {
  // draft에서 받은 res 결과값 s3에 uuid를 이름으로 해서 업로드
  if (request.body.uuid) {
    draft.json.nextNodeKey = "Function#7";
  }
  draft.json.nextNodeKey = "Flow#3";
};
