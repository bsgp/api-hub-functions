module.exports = async (draft, { file }) => {
	const remotePath = '/custom/FROM_OpenText';
	const fullPathList = await file.list(remotePath);
	
// 	const resultList = [];
// 	for(let idx = 0; idx < fullPathList.length; idx += 1){
// 	    const path = fullPathList[idx];
// 	    const result = await file.copy(path, path.replace(/\.gz$/,''))
// 	    resultList.push(result);
// 	}
	
	draft.response.body = fullPathList;
}
