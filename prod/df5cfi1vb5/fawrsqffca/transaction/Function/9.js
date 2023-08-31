module.exports = async (draft, { request, user, util, sql, log }) => {
	const { method, table, columns } = draft.pipe.json;
	if(method !== "DELETE"){
	    return;
	}
// 	draft.response.body = columns;
// 	return;
	const { type } = util;
	const { data } = request.body;
	
	let errorMessage = "";
	
	if(!type.isArray(data)){
	    errorMessage = "data is not Array";
	}
	
	if(data.length === 0){
	    errorMessage = "data is empty";
	}

    const builder = sql('mysql');
    const query = builder.multi(table);
    
	data.forEach(each=>{
	    if(each.UUID){
            query.add(function(){
        	    this.update({deleted:true}).where({UUID:each.UUID})
            });
	    }
	});
    const result = await query.run();
    
    draft.response = result;
}
