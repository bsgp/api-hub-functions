module.exports = async (draft, { request, user, util, log, sql, lib }) => {
	const {method,table} = draft.pipe.json;
	if(method !== "PATCH"){
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
    	data.every(item => {
    	    const result = validator(item);
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
	
	data.forEach(each => {
	    query.add(function(){
	        this.update({
	            ...each,
	            UPDATED_AT: new Date(),
	            UPDATED_BY: user.key
	        }).where('LOTNO', each.LOTNO);
	    })
	})
	
    const result = await query.run();
    
    if(result.body.code === 'S'){
        const queryLOT = sql().select(table).where('LOTNO', 'IN', data.map(({LOTNO})=>LOTNO));
        const resultLOTs = await queryLOT.run();
        draft.response = resultLOTs;
    }else if(result.body.code === 'F'){
        draft.response.body = {
            errorMessage: "LOT 속성 변경 실패하였습니다"
        }
        draft.response.statusCode = '500';
    }else if(result.body.code === 'P'){
        const successfulLotList = result.body.list.filter(({code}) => code === 'S').map(each => data[each.index].LOTNO);
        const queryLOT = sql().select(table).where('LOTNO', 'IN', successfulLotList);
        const resultLOTs = await queryLOT.run();
        draft.response = resultLOTs;
        // draft.response = result;
    }else{
        draft.response = result;
    }
    return;
}
