module.exports = async (draft, { request, task }) => {
  draft.response.body = [];
  if (request.method === "GET") {
    draft.response.body.push("Exchange Schedule");
    // 1시간 마다 호출
    const scheduling = await task.addSchedule(
      "exchange_scheduler",
      "exchange_test",
      "prod",
      "10 0/1 * * ? *"
    );
    draft.response.body.push(scheduling);
  } else if (request.method === "POST") {
    draft.response.body.push("Exchange byd_sender Schedule");
    const value = request.body.value;
    const cronValue =
      value === "DD"
        ? "30 2 * * ? *"
        : value === "WW"
        ? "30 2 ? * MON *"
        : "30 2 ? 1/1 MON#1 *";
    draft.response.body.push(cronValue);

    const scheduling = await task.addSchedule(
      "exchange_byd_sender",
      "exchange_sender",
      "prod",
      "30 2 * * ? *"
    );

    draft.response.body.push(scheduling);
  }
};
