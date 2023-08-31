const uuid = require('uuid');

module.exports = async (draft, { request, user, util, sql, log }) => {
	const { method, table, columns } = draft.pipe.json;
	if(method !== "POST"){
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
	
	const builder = sql("mysql");
	
	if(!errorMessage){
	    const validator = await builder.validator(table);
    	data.every(item => {
    	    const result = validator(item, {
    	        ignore: "UUID",
    	        rules: {
    	            "BUDAT": "EXACT"
    	        }
    	    });
    	    errorMessage = result.errorMessage;
    	    return result.isValid;
    	})
	}
	
	if(errorMessage){
	    draft.response.body = { errorMessage };
	    draft.response.statusCode = 400;
	    return;
	}
	
	
	const list = data.map(item => {
	    const newItem = {
	        ...item
	    };
	    Object.keys(newItem).forEach(key => {
	        if(!['NOTE'].includes(key) && util.type.isString(newItem[key])){
	            newItem[key] = newItem[key].toUpperCase();
	        }
	    })
	    if(type.isFalsy(item.UUID)){
	        newItem.UUID = uuid.v4();
	    }
	    newItem.MJAHR = item.BUDAT.substring(0, 4);
	    newItem.MONAT = item.BUDAT.substring(4, 6);
	    newItem.CREATED_BY = user.key;
	    return newItem;
	});
	
	const query = builder.multi(table, {force:true});
	list.forEach(each=>{
	    query.add(function(){
	        this.insert(each);
	    })
	})
    const result = await query.run();
    
    switch(result.body.code){
        case "S": {
            draft.response.body = {
                code: result.body.code,
                results: []
            };
            break;
        };
        case "F": {
            draft.response.body = {
                code: result.body.code,
                results: result.body.list.map(({code, data}, index)=>({
                    // code,
                    // errorCode: code === "F" ? data.code : undefined,
                    errorMessage: "이미 존재하는 Lot 번호입니다."
                }))
            };
            break;
        };
        case "P": {
            draft.response.body = {
                code: result.body.code,
                results: result.body.list.map(({code, data}, index)=>({
                    code,
                    errorCode: code === "F" ? data.code : undefined,
                    data: code === "F" ? list[index] : undefined
                }))
            };
            
            break;
        }
        default: {
            draft.response.body = "code in body is not valid";
            draft.response.statusCode = "500";
            break;
        }
    }
}
