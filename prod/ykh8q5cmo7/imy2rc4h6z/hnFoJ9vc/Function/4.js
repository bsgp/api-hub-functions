module.exports = async (draft, { sql }) => {
    const builder = sql("mysql");
    const { method, table, dataRows } = draft.pipe.json;
    
	if (method !== "POST") {
	    return;
	}
	
	draft.response = await builder.insert(table, dataRows).run();
}
