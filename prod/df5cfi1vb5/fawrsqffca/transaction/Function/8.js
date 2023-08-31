
module.exports = async (draft, { request, user, util, sql, log }) => {
	const { method, table, columns, sListE } = draft.pipe.json;
	if(method !== "POST"){
	    return;
	}

    if(sListE === undefined){
        return;
    }
    
    const builder = sql();
    
    if(sListE.length > 0){
	    for (let idxE = 0; idxE < sListE.length; idxE += 1){
	        const each = sListE[idxE];
	        const queryB = builder.select(table)
	            .where("LOTNO", each.LOTNO)
	            .where("ROUTG", each.ROUTG)
	            .where("BEEND", "B",).where(function(){
                    this.whereNull("RLUID").orWhere("RLUID","")
                });
            
            const resultB = await queryB.run();
            if(resultB.body.count > 0){
                const tranB = resultB.body.list[0];
                
                const updQueryB = builder.update(table, {...tranB, RLUID: each.UUID}).where("UUID",tranB.UUID);
                const resQueryB = await updQueryB.run();
                log(JSON.stringify(resQueryB));
                
                const updQueryE = builder.update(table, {...each, RLUID: tranB.UUID}).where("UUID",each.UUID);
                const resQueryE = await updQueryE.run();
                log(JSON.stringify(resQueryE));
            }
	    }
	}
}
