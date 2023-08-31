module.exports = async (draft, { request, util, log, sql }) => {
	const {method,table} = draft.pipe.json;
	if(method !== "PUT"){
        return;
    }

    const reqBody = request.body;
    
    const data = util.clone(reqBody.data).map(util.upKeys);

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

    const mysql = sql('mysql').multi(table);
    
    const totalList = [];
    
    if(cList.length > 0){
        cList.forEach(item => {
            const newItem = {...item};
            delete newItem.ORIGINAL_CODE;
            delete newItem.CUD;
            mysql.add(function(){
                const mergeItem = {...newItem, DELETED: false, UPDATED_AT: new Date()};
                delete mergeItem.CODE;
                this.insert(newItem).onConflict('CODE').merge(mergeItem);
            });
            totalList.push(item);
        })
        
    }

    if(uList.length > 0){
        uList.forEach(item => {
            const newItem = {...item};
            delete newItem.ORIGINAL_CODE;
            delete newItem.CUD;
            newItem.UPDATED_AT = new Date();
            mysql.add(function(){
                this.update(newItem).where({CODE:item.ORIGINAL_CODE});
            });
            totalList.push(item);
        })
    }
    
    if(dList.length > 0){
        dList.forEach(item => {
            mysql.add(function(){
                this.update({DELETED:true}).where({CODE:item.ORIGINAL_CODE});
            });
            totalList.push(item);
        })
    }
    
    if(totalList.length > 0){
        const result = await mysql.run();
        
        if(result.statusCode === 200){
            draft.response.body = "성공하였습니다";
        }else{
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
                    errorMessage: `CODE ${item.CODE}를 처리 실패하였습니다 (error: ${error.code || error.message || error.errorMessage})`,
                    data: item
                };
                // draft.response.body = error;
            }
        }
    }
}
