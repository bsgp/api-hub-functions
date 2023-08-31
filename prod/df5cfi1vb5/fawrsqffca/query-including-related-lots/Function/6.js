module.exports = async (draft, { request, util, sql, getUser }) => {
	const { method, table, tList } = draft.pipe.json;
	if(method !== "GET"){
	    return;
	}
	
	const lotList = draft.pipe.json.lotList;
	
    const queryMSEG = sql().select(table.mseg).where('LOTNO', "IN", lotList).whereNot("ROUTG","R80");
    const msegList = await queryMSEG.run();
    const userKeys = Object.keys(msegList.body.list.reduce((acc, row)=>{
        acc[row.CREATED_BY] = "";
        return acc;
    },{})).filter(Boolean);
    
    const users = await getUser('-',{keys:userKeys,fields:["name","key"]})
    
    draft.pipe.json.msegList = msegList.body.list;
    draft.pipe.json.users = users.reduce((acc, user)=>{
        acc[user.key] = user;
        return acc;
    },{});
    
    // draft.response = msegList;
    draft.response.body = {
        users: draft.pipe.json.users,
        mseg: draft.pipe.json.msegList
    }
}
