module.exports = async (draft, {request, util, file}) => {
    const {tryit} = util;
    
    const method = request.method;
    
    draft.pipe.json.method = method;
    
    const result = await file.get("config/tables.json", {gziped:true,toJSON:true});
    draft.pipe.json.tables = result;
    
    const tableName = tryit(()=>request.params.type) || tryit(()=>request.body.type);
    draft.pipe.json.table = result[tableName.toLowerCase()].name;
}
