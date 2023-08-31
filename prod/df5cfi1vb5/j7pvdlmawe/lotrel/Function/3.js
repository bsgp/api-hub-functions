module.exports = async (draft, { request, user, util, log, sql }) => {
	const {method,table} = draft.pipe.json;
	if(method !== "PUT"){
        return;
    }

    const reqBody = request.body;

    const data = util.upKeys(util.clone(reqBody.data));

    const builder = sql('mysql');
    
    let errorMessage = undefined;
    
	if(!errorMessage){
	    const validator = await builder.validator(table);
	    const rules = {};
	    
    	const result = validator(data, {rules, ignore: "SHALLOW"});
	    errorMessage = result.errorMessage;
	}
	
	if(errorMessage){
	    draft.response.body = { errorMessage };
	    draft.response.statusCode = 400;
	    return;
	}
	
	Object.keys(data).forEach(key => {
	    if(util.type.isString(data[key])){
	        data[key] = data[key].toUpperCase();
	    }
	})

    const lotDual = [data.LOTNO_B, data.LOTNO_E, false];
    const queryLOTREL = builder.select(table).where("LOTNO_B", data.LOTNO_B).where("ROUTG", "<", data.ROUTG);
    const resultLOTREL = await queryLOTREL.run();
    const lotList = resultLOTREL.body.list.map(each => each.LOTNO_E).filter(lotno => !lotDual.includes(lotno));
    
    const lotPairs = lotList.reduce((acc, lotno) => {
        const aData = [lotno, lotDual[1], true];
        if(acc.findIndex(each => each[0] === aData[0] && each[1] === aData[1]) < 0){
            acc.push(aData);
        }
        const bData = [lotDual[1], lotno, true];
        if(acc.findIndex(each => each[0] === bData[0] && each[1] === bData[1]) < 0){
            acc.push(bData);
        }
        return acc;
    }, [lotDual, lotDual[1] === lotDual[0] ? undefined : [lotDual[1], lotDual[0], true]]).filter(Boolean);
    
    const queryNewLotRel = sql().multi(table);
    const primaryColumns = ["LOTNO_B", "LOTNO_E"];

    lotPairs.forEach(pair => {
        const newItem = {
            LOTNO_B: pair[0],
            LOTNO_E: pair[1],
            ROUTG: data.ROUTG,
            SHALLOW: pair[2],
            CREATED_BY: user.key
        }
        const mergeItem = {
            ...newItem,
            UPDATED_AT: new Date(),
            UPDATED_BY: user.key
        };
        queryNewLotRel.add(function(){
            this.insert(newItem).onConflict(primaryColumns).merge(mergeItem);
        })
    })
    

    const result = await queryNewLotRel.run();
    
    if(result.statusCode === 200){
        draft.response.body = "성공하였습니다";
    }else{
        draft.response = result;
    }
}
