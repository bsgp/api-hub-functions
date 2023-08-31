module.exports = async (draft, { request, user, util, log, sql }) => {
	const {method,table, tableMSEG} = draft.pipe.json;
	if(method !== "GET"){
        return;
    }

    const body = util.upKeys(util.clone(request.params));
    const {LOTNO} = body;
    const withTransactions = body.hasOwnProperty("WITH_TRANSACTIONS");

    const builder = sql('mysql');
    const subQuery = sql().select(table, 'LOTNO_E').where("LOTNO_B", LOTNO);

    const queryLOTREL = builder.select(table).where("LOTNO_B", LOTNO).where('SHALLOW', false).union(function(){
        this.select().from(table).where("LOTNO_B", "in", subQuery).where('SHALLOW', false);
    }).orderBy([{ column: 'UPDATED_AT', order: 'desc' }]);
    const resultLOTREL = await queryLOTREL.run();
    

    const result = await queryLOTREL.run();
    
    if(result.statusCode === 200){
        if(!withTransactions || result.body.count === 0){
            draft.response = result;
        }else{
            const lotList = result.body.list.map(each => each.LOTNO_E);
            const queryMSEG = sql().select(tableMSEG).where('LOTNO', "IN", lotList);
            const msegList = await queryMSEG.run();
            draft.response = msegList;
        }
    }else{
        draft.response = result;
    }
}
