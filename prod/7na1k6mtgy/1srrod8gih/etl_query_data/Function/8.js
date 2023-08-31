module.exports = async (draft) => {
  // your script
  draft.response.body = {
    uuid: draft.json.response.uuid,
    // query result는 S3에 uuid 이름으로 저장
  };
};
