module.exports = async (draft, { task }) => {
  const taskID = await task.create(
    "create_edi_order_task_prod",
    "edi_order_prod",
    "prod"
  );
  draft.response.body = taskID;
};
