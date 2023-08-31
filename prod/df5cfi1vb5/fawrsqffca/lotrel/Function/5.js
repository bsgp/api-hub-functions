module.exports = async (draft, {request, util, file}) => {
    const {tryit} = util;
    
    const method = request.method;
    
    draft.pipe.json.method = method;
    
    const result = await file.get("config/tables.json", {gziped:true,toJSON:true});
    draft.pipe.json.tables = result;
    
    draft.pipe.json.table = result["lotno_rel"].name;
    draft.pipe.json.tableMSEG = result["mseg"].name;
}
