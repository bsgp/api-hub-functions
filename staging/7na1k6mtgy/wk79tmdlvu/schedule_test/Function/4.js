module.exports = async (draft, { task, log }) => {
  draft.response.body = [];

  // 10분마다 호출
  //   const result = await task.addSchedule(
  //      taskGroup name,
  //      flow name,
  //      alias(version),
  //      "0/10 * * * ? *"
  //   );

  const schedule = await task.addSchedule(
    "get_exchange",
    "get_file_from_sftp_prod",
    "latest",
    "10 11 * * ? *"
  );

  draft.response.body.push("Exchange schedule!!!");
  log(schedule);
};
