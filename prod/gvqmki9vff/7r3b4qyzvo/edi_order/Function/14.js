module.exports = async (draft, { file }) => {
	
	draft.response.body = [];
	
	const result = await file.list('/custom/FROM_OpenText/');  //배열로 받아옴
	
	for(let i=0;i < result.length;i++ ){
	    const a = result[i].substr(result[i].lastIndexOf('/',)+1 ,99);
	    draft.response.body.push({i : '/custom/FROM_OpenText_done/' + a});
	}

// 	draft.response.body.push({r1 : result});
	
// 	const result3 = await file.move('/custom/FROM_OpenText_done/ord_5013546119636_20210531010955.xml' ,'/custom/FROM_OpenText/ord_5013546119636_20210531010955.xml');

// 	const result3 = await file.move('/custom/FROM_OpenText/ord_5013546119636_20210531010955.xml','/custom/FROM_OpenText_done/ord_5013546119636_20210531010955.xml');
    // draft.response.body.push({r3 : result3});
    
	const result2 = await file.list('/custom/FROM_OpenText_done/');  //배열로 받아옴
// 	draft.response.body.push({r2 : result2});

}
