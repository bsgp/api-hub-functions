module.exports = async (draft, { getUser }) => {
	const users = await getUser("-",{keys: ["undlf2"],fields:["name","key"]});
	draft.response.body = users;
}
