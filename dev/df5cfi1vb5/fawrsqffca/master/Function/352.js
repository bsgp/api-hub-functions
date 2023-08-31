module.exports = async (draft, {request, sql, util}) => {
    const {method,table} = draft.pipe.json;
    if(method !== "GET"){
        return;
    }
    const {tryit} = util;
    
    const reqBody = request.params;
    
    const code = tryit(()=>reqBody.code.toUpperCase());
    const search = tryit(()=>reqBody.search.toUpperCase());
    
    const mysql = sql('mysql')
    const query = mysql.select(table).where(function(){
        this.whereNull("deleted").orWhere({deleted:false});
    });
    if(code){
        query.where({CODE: code});
    }
    if(search){
        query.where(function(){
            this.whereRaw(`UPPER(TEXT) LIKE ?`,[`%${search}%`]).orWhereRaw(`UPPER(CODE) LIKE ?`,[`%${search}%`])
        })
    }
    const result = await query.run();

    draft.response = result;
}
