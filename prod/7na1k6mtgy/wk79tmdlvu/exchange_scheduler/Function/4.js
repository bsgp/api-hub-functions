module.exports = async (
  draft,
  {
    request, // ,task, log
  }
) => {
  draft.response.body = [];
  if (request.method === "POST") {
    draft.response.body.push("Exchange byd_sender Schedule");
    const cronValue = request.body.value;
    draft.response.body.push(cronValue);
    // 1시간 마다 호출
    // const scheduling = await task.addSchedule(
    //   "exchange_byd_sender",
    //   "exchange_sender",
    //   "prod",
    //   cronValue
    // );

    // draft.response.body.push(scheduling);
  }
};
