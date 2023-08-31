module.exports = async (draft, { file }) => {
	const result = await file.get("/ff/dk");
	draft.response.body = result;
}
