module.exports = async (draft, { task }) => {
	const taskID = await task.create("test", "soap", "latest", {ff:"dk"});
	draft.response.body = taskID;
}
