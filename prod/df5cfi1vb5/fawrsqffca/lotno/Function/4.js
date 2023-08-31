module.exports = async (draft, { request, user, util, log, sql, lib }) => {
	const {method,table} = draft.pipe.json;
	if(method !== "POST"){
        return;
    }

    const reqBody = request.body;
    
    const data = util.upKeys(reqBody.data);

	const builder = sql("mysql");
	
    const validator = await builder.validator(table);
	const result = validator(data);
    
    if(!result.isValid){
	    draft.response.body = { errorMessage: result.errorMessage };
	    draft.response.statusCode = 400;
	    return;
    }
	
    if(data.SQBSK !== undefined){
        // create LOT number by latest sequence
        
        if(data.LOTNO === undefined){
            draft.response.body = {
                errorMessage: "LOTNO is required"
            }
            draft.response.statusCode = 400;
            return;
        }
        
        const querySEQ = sql().select(table).max({'LATEST_SEQUANCE':'SEQNC'}).where('SQBSK', data.SQBSK);
        const latestResult = await querySEQ.run();
        let latestSEQ = latestResult.body.list[0].LATEST_SEQUANCE;
        
        const matched = data.LOTNO.match(/\+([^+]{1,})\+/);
        if(!matched){
            draft.response.body = {
                errorMessage: "LOTNO must includes pattern like +XXX-5+"
            }
            draft.response.statusCode = 400;
            return;
        }
        const replacingPattern = matched[0];
        const [pattern, count] = matched[1].split('-');
        const intCount = parseInt(count, 10) || 1;
        
        log("latestSEQ:", latestSEQ);
        
        if(!latestSEQ){
            latestSEQ = pattern.split('').reduce((acc, char) => {
                if(char === 'N'){
                    return acc + '0';
                }
                if(char === 'C'){
                    return acc + ' ';
                }
            },'')
        }
        
        // "001" => "002"
        // "A" => "B"
        // "AZ" => "BA"
        // "1A" => "1B"
        const newSeqList = lib.getNextSeq(latestSEQ, intCount);
        // draft.response.body = {latestSEQ,count, newSeqList};
        // return;
        const query = builder.multi(table, {force:true});
        const lotObjList = newSeqList.map(seq => {
            return {
                LOTNO: data.LOTNO.replace(replacingPattern, seq),
                SEQNC: seq,
                SQBSK: data.SQBSK,
                EXTLO: data.EXTLO && data.EXTLO.toUpperCase(),
                PRTFL: false,
                CREATED_BY: user.key
            }
        });
        lotObjList.forEach(lotObj => {
            query.add(function(){
                this.insert(lotObj);
            })
        })
        
        log("lot list", JSON.stringify(lotObjList));
        // const query = builder.insert(table, lotObjList);
        const result = await query.run();
        
        if(result.body.code === 'S'){
            const queryLOT = sql().select(table).where('LOTNO', 'IN', lotObjList.map(({LOTNO})=>LOTNO));
            const resultLOTs = await queryLOT.run();
            draft.response = resultLOTs;
        }else if(result.body.code === 'F'){
            draft.response.body = {
                errorMessage: "LOT번호 생성 실패하였습니다. 다시 시도해보세요."
            }
            draft.response.statusCode = '500';
        }else if(result.body.code === 'P'){
            const successfulLotList = result.body.list.filter(({code}) => code === 'S').map(each => lotObjList[each.index].LOTNO);
            const queryLOT = sql().select(table).where('LOTNO', 'IN', successfulLotList);
            const resultLOTs = await queryLOT.run();
            draft.response = resultLOTs;
            // draft.response = result;
        }else{
            draft.response = result;
        }
        return;
    }else{
        // insert LOT number
        if(!data.LOTNO){
            draft.response.body = {
                errorMessage: "Lot Number is required"
            };
            draft.response.statusCode = 400;
            return;
        }
        const lotObj = {
            LOTNO: data.LOTNO,
            CREATED_BY: user.key
        }
        const query = builder.insert(table, lotObj);
        const result = await query.run();
        if(result.statusCode === 200){
            const queryLOT = sql().select(table).where('LOTNO', lotObj.LOTNO);
            const resultLOTs = await queryLOT.run();
            draft.response = resultLOTs;
        }else{
            draft.response.body = {
                errorMessage: "이미 존재하는 Lot 번호입니다"
            }
            draft.response.statusCode = 400;
            return;
        }
    }
    
    // if(result.statusCode === 200){
    //     draft.response.body = "성공하였습니다";
    // }else{
    //     const lastIndex = result.body.length - 1;
    //     const error = result.body[lastIndex];
    //     const item = totalList[lastIndex];
    //     if(error.code === "ER_DUP_ENTRY"){
    //         draft.response.body = {
    //             errorMessage: `CODE ${item.CODE}가 이미 존재합니다`,
    //             data: item
    //         };
    //     }else{
    //         draft.response.body = {
    //             errorMessage: `CODE ${item.CODE}를 처리 실패하였습니다 (error: ${error.code || error.message || error.errorMessage})`,
    //             data: item
    //         };
    //         // draft.response.body = error;
    //     }
    // }
}
