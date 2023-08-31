module.exports = async (draft, { task }) => {
	const taskID = await task.create("create_edi_order_task", "edi_order", "latest");
 	draft.response.body = taskID;
 	
}
