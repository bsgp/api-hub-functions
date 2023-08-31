module.exports = async (draft, { request, file }) => {
	const result = await file.get("config/tables.json", { gziped: true, toJSON: true });
	draft.pipe.json.tables = result;
}
