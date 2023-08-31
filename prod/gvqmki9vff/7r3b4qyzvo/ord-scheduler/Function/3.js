module.exports = async (draft, { task }) => {
  draft.response.body = [];

  // 10분마다 호출
  await task.addSchedule(
    "get_from_sftp_prod",
    "get_file_from_sftp_prod",
    "latest",
    "0/10 * * * ? *"
  );
  //판매오더 스케줄

  // 1시간 마다 호출 - 조이사님 요청
  // await task.addSchedule(
  //   "get_from_sftp_prod",
  //   "get_file_from_sftp_prod",
  //   "latest",
  //   "50 0/1 * * ? *"
  // ); //판매오더 스케줄
  draft.response.body.push("get_from_sftp");
};
