module.exports = async (draft) => {
  // 현재 위치만 수정하면 됨
  draft.json.rmPath = "soCreateResult/so/";
  // draft.json.rmPath = "soCreateResult/so/";
  draft.json.divideNum = 5;
};
