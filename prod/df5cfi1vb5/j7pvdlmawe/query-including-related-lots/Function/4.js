module.exports = async (draft, { request, util, sql }) => {
	const { method, table } = draft.pipe.json;
	if(method !== "GET"){
	    return;
	}
	
	const { type } = util;
	
	const params = util.upKeys(request.params);
	const lotno = params.LOTNO && params.LOTNO.toUpperCase();
	const routg = params.ROUTG && params.ROUTG.toUpperCase();
	const budat = params.BUDAT;
	const budatTo = params.BUDAT_TO;

    const query = sql("mysql").select(table.mseg);
    if(lotno){
        query.where('LOTNO', lotno);
    }
    if(routg){
        const routgList = routg.split(",");
        query.where('ROUTG', 'in', routgList);
    }
    if(budatTo && budat){
        query.whereBetween("BUDAT", [budat, budatTo]);
    }else if(budat){
        query.where('BUDAT', budat);
    }
    query.orderBy('UPDATED_AT');
    const result = await query.run();
    
    draft.pipe.json.tList = result.body.list;
    
    draft.response = result;
}
