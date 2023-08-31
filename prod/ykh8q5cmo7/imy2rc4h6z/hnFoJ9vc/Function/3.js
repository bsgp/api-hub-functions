module.exports = async (draft, { sql }) => {
    const builder = sql("mysql");
    const { method, table } = draft.pipe.json;
    
	if (method !== "GET") {
	    return;
	}
	
	draft.response = await builder.select(table).where(queryNotDeleted).run();
	
	/* tools */
	function queryNotDeleted() {
	    this.whereNull("deleted").orWhere({ deleted: false });
	}
}
