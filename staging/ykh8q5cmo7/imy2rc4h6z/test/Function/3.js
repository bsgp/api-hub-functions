module.exports = async (draft, { request }) => {
	// your script
	
	draft.response.statusCode = 200;
	draft.response.body = { info: "hello" };
}
