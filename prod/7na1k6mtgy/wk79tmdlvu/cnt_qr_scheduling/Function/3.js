module.exports = async (draft, { request, task }) => {
  draft.response.body = [];
  if (request.method === "GET") {
    draft.response.body.push("cntech_modify_scheduler");
    // 1시간 마다 호출
    const scheduling = await task.addSchedule(
      "cntech_patch_scheduler",
      "cntech_qualityresult_patch",
      "prod",
      "0/10 * * * ? *"
    );
    draft.response.body.push(scheduling);
  }
};
