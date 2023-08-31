module.exports = async (draft, {request, util, sql, log}) => {
    const {method,table} = draft.pipe.json;
    const isCU = ["POST","PATCH"].includes(method);
    if(!isCU){
        return;
    }
    
    // isCreate => isUpdate ?
    const isCreate = method === "POST";
    const isUpdate = method === "PATCH";
    
    const reqBody = request.body;
    
    const data = util.clone(reqBody.data);
    
    if(isCreate){
        if(!Array.isArray(data)) {
            draft.response.statusCode = 400;
            draft.response.body = {
                errorMessage: "배열이 아닙니다."
            };
            return;
        }
        data.forEach(each =>{
            if(!each.CODE) {
            draft.response.statusCode = 400;
            draft.response.body = {
                errorMessage: "code값은 필수입니다"
            };
            return;
        }
        })
        
        // if(!data.code){
        //     draft.response.statusCode = 400;
        //     draft.response.body = {
        //         errorMessage: "code값은 필수입니다"
        //     };
        //     return;
        // } 
    }

    // const code = data.code.toUpperCase();
    // data.code = code;
    
    const mysql = sql('mysql');
    
    if(isCreate){
        const result = await mysql.insert(table, data).run();
        
        log(JSON.stringify(result.body));
        draft.response = result;
        if(result.statusCode !== 200){
            data.forEach(async data => {
                
                if(data.DELETED) {
                    const result = await mysql.update(table, {deleted:true}).where({CODE:data.CODE}).run();
    
                    draft.response = result;
                    log("statusCode:", result.statusCode, draft.response.statusCode);
                    if(result.statusCode === 200){
                        draft.response.body = "삭제 성공하였습니다"
                    }else{
                        draft.response.body = "삭제 실패하였습니다"
                    }
                }
                const selectResult = await mysql.select(table).where({CODE: data.CODE}).run();
                log(selectResult.statusCode, JSON.stringify(selectResult.body));
                
                if(selectResult.statusCode === 200){
                    if(selectResult.body[0].DELETED === true){
                        draft.response.body = {
                            errorMessage: "이미 삭제된 마스터 데이터가 존재합니다"
                        };
                        return;
                    }
                    if(selectResult.body[0].DELETED === false){
                        draft.response.body = {
                            errorMessage: "같은 키값으로 마스터 데이터가 존재합니다"
                        };
                        return;
                    }
                }
                draft.response.body = {
                    errorMessage: "마스터 데이터 추가 실패했습니다"
                };
                return;
            })
        }
    }else if(isUpdate){
        const newData = {
            ...data
        };
        delete newData.code;
        const result = await mysql.update(table, newData).where({code}).run();
        draft.response = result;
        if(result.statusCode !== 200){
            draft.response.body = {
                errorMessage: "마스터 데이터 변경 실패했습니다."
            };
        }
    }
}
