module.exports = async (draft, { task, log }) => {
  draft.response.body = [];
  //매일 23시 59분에 발송
  const result1 = await task.addSchedule(
    "send_daily_stock",
    "daily_stock_to_pantos_by_task",
    "latest",
    "50 23 * * ? *"
  ); //재고 스케줄 59분에 발송안됨. 50분으로 함
  draft.response.body.push("Stock Schedule");

  log(result1);

  // 10분마다 발송
  //   const result2 = await task.addSchedule("send_material_info", "material_info_to_pantos_by_task", "latest", "0/10 * * * ? *");  //자재(상품) 마스터 스케줄
  //  1시간 마다 발송
  const result2 = await task.addSchedule(
    "send_material_info",
    "material_info_to_pantos_by_task",
    "latest",
    "0 0/1 * * ? *"
  ); //자재(상품) 마스터 스케줄
  draft.response.body.push("Material Schedule");
  log(result2);
};
