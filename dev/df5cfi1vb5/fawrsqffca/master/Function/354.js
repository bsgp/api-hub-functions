module.exports = async (draft, { request, sql, log }) => {
    const {method,table} = draft.pipe.json;
	if(method !== "DELETE"){
        return;
    }

    const reqBody = request.body;
    
    const data = {...reqBody.data};
    data.code = data.code.toUpperCase();

    const mysql = sql('mysql');
    const result = await mysql.update(table, {deleted:true}).where({CODE:data.code}).run();
    
    draft.response = result;
    log("statusCode:", result.statusCode, draft.response.statusCode);
    if(result.statusCode === 200){
        draft.response.body = "삭제 성공하였습니다"
    }else{
        draft.response.body = "삭제 실패하였습니다"
    }
}
