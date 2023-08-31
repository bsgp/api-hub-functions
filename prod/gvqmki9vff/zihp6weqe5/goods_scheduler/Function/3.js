module.exports = async (draft, { request, task }) => {
  draft.response.body = [];
  if (request.method === "GET") {
    draft.response.body.push("Goods Schedule");
    // 10분 마다 호출
    const scheduling = await task.addSchedule(
      "goods_scheduler1",
      "do_goods_stock_change",
      "prod",
      "0/10 * * * ? *"
    );
    draft.response.body.push(scheduling);
  }
};
