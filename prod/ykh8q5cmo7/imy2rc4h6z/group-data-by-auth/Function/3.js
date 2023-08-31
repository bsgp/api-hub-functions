module.exports = async (draft, {request, util, file}) => {
    const {tryit} = util;
    
    const result = await file.get("config/tables.json", {gziped:true,toJSON:true});
    
    draft.pipe.json.tables = result;
    draft.pipe.json.user = tryit(() => request.params.user);
}
