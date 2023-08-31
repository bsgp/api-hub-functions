module.exports = async (draft, { request, user, util, log, sql, lib }) => {
	const {method,table} = draft.pipe.json;
	if(method !== "DELETE"){
        return;
    }

    const { type } = util;
	const { data } = request.body;
	
	let errorMessage = "";
	
	if(!type.isArray(data)){
	    errorMessage = "data is not Array";
	}
	
	if(data.length === 0){
	    errorMessage = "data is empty";
	}
	
	const builder = sql("mysql");
	
	if(!errorMessage){
	    const validator = await builder.validator(table);
    	data.every(lotno => {
    	    const result = validator({LOTNO: lotno});
    	    errorMessage = result.errorMessage;
    	    return result.isValid;
    	})
	}
	
	if(errorMessage){
	    draft.response.body = { errorMessage };
	    draft.response.statusCode = 400;
	    return;
	}
	
	const query = builder.multi(table);
	
	data.forEach(lotno => {
	    query.add(function(){
	        this.update({
	            DELETED: true,
	            UPDATED_AT: new Date(),
	            UPDATED_BY: user.key
	        }).where('LOTNO', lotno);
	    })
	})
	
    const result = await query.run();
    
    if(result.body.code === 'S'){
        const queryLOT = sql().select(table).where('LOTNO', 'IN', data.map(LOTNO=>LOTNO));
        const resultLOTs = await queryLOT.run();
        draft.response = resultLOTs;
    }else if(result.body.code === 'F'){
        draft.response.body = {
            errorMessage: "LOT 삭제 실패하였습니다"
        }
        draft.response.statusCode = '500';
    }else if(result.body.code === 'P'){
        const successfulLotList = result.body.list.filter(({code}) => code === 'S').map(each => data[each.index]);
        const queryLOT = sql().select(table).where('LOTNO', 'IN', successfulLotList);
        const resultLOTs = await queryLOT.run();
        draft.response = resultLOTs;
        // draft.response = result;
    }else{
        draft.response = result;
    }
    return;
}
