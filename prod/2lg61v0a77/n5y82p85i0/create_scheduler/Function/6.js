module.exports = async (draft, { request, task }) => {
  // 221015 스케줄 리스트 조회 리스트 기능 작성
  const { groupID } = request.body;
  const result = await task.deleteSchedule(groupID);

  draft.response.body = result;
};
