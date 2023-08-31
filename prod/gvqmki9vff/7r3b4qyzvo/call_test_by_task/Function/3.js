module.exports = async (draft, { task }) => {
	const taskID = await task.create("create_edi_invoice_task", "test", "latest");
 	draft.response.body = taskID;
 	
}