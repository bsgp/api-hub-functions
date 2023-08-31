module.exports = async (draft, {request, sql, util}) => {
    const {method,table,type} = draft.pipe.json;
    if(method !== "GET"){
        return;
    }
    const {tryit} = util;
    
    const reqBody = request.params;
    
    const code = tryit(()=>reqBody.code.toUpperCase());
    const search = tryit(()=>reqBody.search.toUpperCase());
    const includeDeleted = tryit(()=>reqBody.hasOwnProperty('include_deleted'));
    const data = tryit(()=>JSON.parse(reqBody.data), reqBody.data);
    const materialType = tryit(()=>data["MATERIAL_TYPE"].toUpperCase());
    const routg = tryit(()=>data["ROUTG"].toUpperCase());
    const idntt = tryit(()=>data["IDNTT"].toUpperCase());
    
    const mysql = sql('mysql')
    const query = mysql.select(table)
    
    if(!Boolean(includeDeleted)){
        query.where(function(){
            this.whereNull("deleted").orWhere({deleted:false});
        });
    }
    if(code){
        query.where({CODE: code});
    }
    if(search){
        query.where(function(){
            this.whereRaw(`UPPER(TEXT) LIKE ?`,[`%${search}%`]).orWhereRaw(`UPPER(CODE) LIKE ?`,[`%${search}%`])
        })
    }
    if(materialType){
        query.where({"MATERIAL_TYPE": materialType});
    }
    if(routg){
        query.where({"ROUTG": routg});
    }
    if(idntt){
        query.where({"IDNTT": idntt});
    }
    
    if(type === "resource"){
        query.orderBy([{ column: 'ROUTG' }, { column: 'CODE' }]); //, order: 'desc'
    }else{
        query.orderBy('CODE');
    }
    
    const result = await query.run();

    draft.response = result;
}
