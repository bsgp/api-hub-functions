module.exports = async (draft, { request, file }) => {
	
    const method = request.method;
    
    draft.pipe.json.method = method;
    
    const result = await file.get("config/tables.json", {gziped:true,toJSON:true});
    
    draft.pipe.json.table = {
        mseg: result["mseg"].name,
        lotRel: result["lotno_rel"].name,
        lotno: result["lotno"].name,
        OPERT: result["operation"].name,
        DEFNC: result["scrap"].name,
    }
    // draft.pipe.json.table.mseg = result["mseg"].name;
    // draft.pipe.json.table.lotRel = result["lotno_rel"].name;
}
