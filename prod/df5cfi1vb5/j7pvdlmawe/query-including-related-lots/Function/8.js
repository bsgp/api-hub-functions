module.exports = async (draft, { sql }) => {
    const table = draft.pipe.json.table;
    
	const master = draft.pipe.json.master;
	const masterList = {};
	
	const builder = sql();
	
	const fieldNameList = Object.keys(master);
	for(let idx = 0; idx < fieldNameList.length; idx += 1){
	    const fieldName = fieldNameList[idx];
	    
	    if(master[fieldName].length > 0){
	        const query = builder.select(table[fieldName],["CODE","TEXT"]).where("CODE","in",master[fieldName]);
	        const result = await query.run();
	        masterList[fieldName] = result.body.list;
	    }else{
	        masterList[fieldName] = [];
	    }
	}
	
	draft.response.body.master = masterList;
}
