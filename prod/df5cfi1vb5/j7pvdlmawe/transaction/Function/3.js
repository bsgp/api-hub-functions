module.exports = async (draft, { request, file }) => {
	
    const method = request.method;
    
    draft.pipe.json.method = method;
    
    const result = await file.get("config/tables.json", {gziped:true,toJSON:true});
    
    draft.pipe.json.table = result["mseg"].name;
}
