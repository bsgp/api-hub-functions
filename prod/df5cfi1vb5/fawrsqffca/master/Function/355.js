module.exports = async (draft, { request, user, util, log, sql }) => {
	const {method,table} = draft.pipe.json;
	if(method !== "PUT"){
        return;
    }

    const reqBody = request.body;
    const type = reqBody.type.toUpperCase();
    
    const data = util.clone(reqBody.data).map(util.upKeys);

    const builder = sql('mysql');
    
    let errorMessage = undefined;
    
	if(!errorMessage){
	    const validator = await builder.validator(table);
	    const rules = {};
	    
	    if(type === "MATERIAL"){
	        rules["MATERIAL_TYPE"] = "EXACT";
	    }
	    
    	data.every(item => {
    	    const result = validator(item, {rules});
    	    errorMessage = result.errorMessage;
    	    return result.isValid;
    	})
	}
	
	if(errorMessage){
	    draft.response.body = { errorMessage };
	    draft.response.statusCode = 400;
	    return;
	}
	
    const cList = [];
    const uList = [];
    const dList = [];
    
    data.forEach(item=>{
        if(!item.CODE){
            return;
        }
        
        item.CODE = item.CODE.toUpperCase();
        if(item.ORIGINAL_CODE){
            item.ORIGINAL_CODE = item.ORIGINAL_CODE.toUpperCase();
        }
        item.CUD = item.CUD.toUpperCase();
        switch(item.CUD){
            case "C":
                cList.push({...item});
                break;
            case "U":
                uList.push({...item});
                break;
            case "D":
                dList.push({...item});
                break;
            default:
                break;
        }
    })

    const mysql = builder.multi(table);
    
    const totalList = [];
    
    if(cList.length > 0){
        const primaryColumns = ['CODE'];
        if(type === 'MATERIAL'){
            primaryColumns.push('MATERIAL_TYPE');
        }
        cList.forEach(item => {
            const newItem = {...item};
            delete newItem.CREATED_AT;
            delete newItem.CREATED_BY;
            delete newItem.UPDATED_AT;
            delete newItem.UPDATED_BY;
            delete newItem.ORIGINAL_CODE;
            delete newItem.CUD;
            
            newItem.CREATED_BY = user.key;
            if(type === "MATERIAL"){
                newItem.MATERIAL_TYPE = item.MATERIAL_TYPE && item.MATERIAL_TYPE.toUpperCase();
                newItem.IDNTT = item.IDNTT && item.IDNTT.toUpperCase();
                newItem.UNIT = item.UNIT && item.UNIT.toUpperCase();
                // newItem.ALTCO = item.ALTCO && item.ALTCO.toUpperCase();
            }
            
            mysql.add(function(){
                const mergeItem = {
                    ...newItem,
                    DELETED: false, 
                    UPDATED_AT: new Date(),
                    UPDATED_BY: user.key
                };
                delete mergeItem.CODE;
                this.insert(newItem).onConflict(primaryColumns).merge(mergeItem);
            });
            totalList.push(item);
        })
        
    }

    if(uList.length > 0){
        uList.forEach(item => {
            const newItem = {...item};
            delete newItem.ORIGINAL_CODE;
            delete newItem.CUD;
            delete newItem.CREATED_AT;
            delete newItem.CREATED_BY;
            
            newItem.UPDATED_AT = new Date();
            newItem.UPDATED_BY = user.key;
            if(type === "MATERIAL"){
                newItem.MATERIAL_TYPE = item.MATERIAL_TYPE && item.MATERIAL_TYPE.toUpperCase();
                newItem.IDNTT = item.IDNTT && item.IDNTT.toUpperCase();
                newItem.UNIT = item.UNIT && item.UNIT.toUpperCase();
                // newItem.ALTCO = item.ALTCO && item.ALTCO.toUpperCase();
            }
            
            mysql.add(function(){
                this.update(newItem).where({CODE:item.ORIGINAL_CODE});
                if(type === 'MATERIAL'){
                    this.where({MATERIAL_TYPE: newItem.MATERIAL_TYPE});
                }else if(type === "RESOURCE"){
                    this.where({ROUTG: newItem.ROUTG});
                }
            });
            totalList.push(item);
        })
    }
    
    if(dList.length > 0){
        dList.forEach(item => {
            
            mysql.add(function(){
                this.update({
                    DELETED: true,
                    UPDATED_AT: new Date(),
                    UPDATED_BY: user.key
                }).where({
                    CODE: item.ORIGINAL_CODE
                });
                if(type === 'MATERIAL'){
                    this.where({MATERIAL_TYPE: item.MATERIAL_TYPE});
                }
            });
            totalList.push(item);
        })
    }
    
    if(totalList.length > 0){
        const result = await mysql.run();
        
        if(result.statusCode === 200){
            draft.response.body = "성공하였습니다";
        }else{
            // draft.response = result;
            // return;
            const lastIndex = result.body.length - 1;
            const error = result.body[lastIndex];
            const item = totalList[lastIndex];
            if(error.code === "ER_DUP_ENTRY"){
                draft.response.body = {
                    errorMessage: `CODE ${item.CODE}가 이미 존재합니다`,
                    data: item
                };
            }else{
                draft.response.body = {
                    errorMessage: `CODE ${item.CODE}를 처리 실패하였습니다 (code: ${error.code}, message: ${error.message || error.errorMessage})`,
                    data: item
                };
                // draft.response.body = error;
            }
        }
    }
}
