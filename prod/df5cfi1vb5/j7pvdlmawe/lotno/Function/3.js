module.exports = async (draft, {request, util, file}) => {
    const {tryit} = util;
    
    const method = request.method;
    
    draft.pipe.json.method = method;
    
    const result = await file.get("config/tables.json", {gziped:true,toJSON:true});
    draft.pipe.json.tables = result;
    
    const tableName = tryit(()=>request.path.replace("/", ""));
    if(tableName === undefined){
        draft.response.body = { errorMessage: "Failed to get table name" };
        draft.response.statusCode = 400;
        return;
    }
    draft.pipe.json.table = result[tableName.toLowerCase()].name;
    if(draft.pipe.json.table === undefined){
        draft.response.body = { errorMessage: "Failed to get table name from list" };
        draft.response.statusCode = 400;
        return;
    }
}
