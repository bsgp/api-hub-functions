module.exports = async (draft, { task }) => {
  const taskID = await task.create(
    "create_edi_invoice_task_prod",
    "invoice_to_sftp_prod",
    "prod"
  );
  draft.response.body = taskID;
};
