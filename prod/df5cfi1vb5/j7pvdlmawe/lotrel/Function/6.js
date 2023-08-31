module.exports = async (draft, { request, user, util, log, sql }) => {
	const {method,table} = draft.pipe.json;
	if(method !== "PATCH"){
        return;
    }

    const builder = sql();
    
    const query = builder.select(table);
    
    const result = await query.run();

    const updator = builder.multi(table);
    result.body.list.forEach(row => {
        const newROUTG = row.ROUTG.toUpperCase();
        updator.add(function(){
            this.update({ROUTG:newROUTG}).where({
                LOTNO_B: row.LOTNO_B,
                LOTNO_E: row.LOTNO_E,
                ROUTG: row.ROUTG
            })
        })
    });
    
    const updateResult = await updator.run();
    
    draft.response = updateResult;
}
