module.exports = async (draft, { task }) => {
  // const getSO = await task.addSchedule(
  //   "nextchapter_salesorder", // task name
  //   "nextchapter_salesorder", // flow name
  //   "prod",
  //   "0 16 * * ? *"
  // ); // 판매오더 data 수집 api 매일 01시 실행

  //  1시에 실행
  const SO_Invoker = await task.addSchedule(
    "nextchapter_salesorder_creator",
    "nextchapter_salesorder_creator",
    "prod",
    "0 17 * * ? *"
  ); // 판매오더 처리 flow 매일 01시 10분 실행

  draft.response.body = {
    // getSO,
    SO_Invoker,
  };
};
