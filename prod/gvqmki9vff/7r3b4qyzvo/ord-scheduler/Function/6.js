module.exports = async (draft, { task }) => {
  // 1시간 마다 호출
  await task.addSchedule(
    "get_sftp_file_check",
    "sftp_file_check",
    "prod",
    "0 0/1 * * ? *"
  ); //SFTP FILE CHECK 스케줄
  draft.response.body = { message: "SFTP FILE CHECK Schedule" };
};
