module.exports = async (draft, { request, sql, log }) => {
	const {table} = draft.pipe.json;
	
	const multi = sql("mysql").multi(table);
	
	multi.add(function(){
	    this.columnInfo();
	})
	const result = await multi.run();
	
	draft.pipe.json.columns = result.body[0];
}
