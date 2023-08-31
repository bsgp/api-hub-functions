module.exports = async (draft, { request, util, sql }) => {
	const { method, table, tList } = draft.pipe.json;
	if(method !== "GET"){
	    return;
	}
	
	const lotList1 = tList.map(({LOTNO})=>LOTNO);
	
	
    const builder = sql('mysql');
    const subQuery = sql().select(table.lotRel, 'LOTNO_E').where("LOTNO_B", "in", lotList1);

    const queryLOTREL = builder.select(table.lotRel, ['LOTNO_B','LOTNO_E','ROUTG']).where("LOTNO_B", "in", lotList1).where('SHALLOW', false).union(function(){
        this.select(['LOTNO_B','LOTNO_E','ROUTG']).from(table.lotRel).where("LOTNO_B", "in", subQuery).where('SHALLOW', false);
    });
    const resultLOTREL = await queryLOTREL.run();
    

    const result = await queryLOTREL.run();
    
    const rawLotList = result.body.list.filter(each => each.ROUTG === "R10").map(each => each.LOTNO_E);
    const queryLot = builder.select(table.lotno, ["LOTNO","EXTLO"]).where("LOTNO", "in", rawLotList);
    const resultLot = await queryLot.run();
    
    draft.pipe.json.lotMasters = resultLot.body.list.reduce((acc, each)=>{
        acc[each.LOTNO] = {...each};
        return acc;
    },{});
    
    const lotList2 = result.body.list.map(each => each.LOTNO_E);
    
    draft.pipe.json.lotList = lotList2;
    // Object.keys(lotList2.concat(lotList1).reduce((acc, lotno)=>{
    //     acc[lotno] = '';
    //     return acc;
    // },{}));
    draft.pipe.json.keys = result.body.list.reduce((acc, row) => {
        const key = [row.LOTNO_B, row.LOTNO_E].join("-");
        
        const data = {
            data: {}
        }
        
        if(acc[key] === undefined){
            acc[key] = data;
        }
        if(acc[row.LOTNO_B] === undefined){
            acc[row.LOTNO_B] = key;
        }
        
        if(acc[row.LOTNO_E] === undefined){
            acc[row.LOTNO_E] = key;
        }
        
        return acc;
    }, {});
    
    draft.response.body = {
        count: draft.pipe.json.lotList.length,
        resultLot: resultLot.body.list,
        list: result.body.list,
        keys: draft.pipe.json.keys
    };
}
