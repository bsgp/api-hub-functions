module.exports = async (draft, { task }) => {
  const taskID = await task.create(
    "send_daily_stock_task",
    "daily_stock_to_pantos",
    "prod"
  );
  draft.response.body = taskID;
};
