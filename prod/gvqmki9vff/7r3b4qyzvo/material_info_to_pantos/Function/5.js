module.exports = async (draft, { odata }) => {
    
    draft.response.body = [];
    
	const isTest = true;

    let url;
    let username;
    let password;

	if(isTest){
	    url = 'https://my356725.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPZE65699D3904469A4885865QueryResults?$select=TSITE_UUID,CSITE_UUID,TMATERIAL_UUID,CMATERIAL_UUID,KCON_HAND_STOCK,KCRESTRICTED_STOCK,KCUN_RESTRICTED_STOCK&$filter=(CSITE_UUID%20eq%20%27EXTERNAL_WAREHOUSE_1%27)&$format=json'
        username = 'bsg1';
        password = '1234';
	}else{
	    url = 'https://my357084.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPZ4598AAD9A4214E7FB4CF73QueryResults?$select=TMATERIAL_UUID,CMATERIAL_UUID,CSITE_UUID,TSITE_UUID,KCON_HAND_STOCK,KCRESTRICTED_STOCK,KCUN_RESTRICTED_STOCK&$filter=(CSITE_UUID%20eq%20%279000%27%20or%20CSITE_UUID%20eq%20%279100%27)&$format=json'
	    username = 'cfo';
        password = 'QWEasd12';
	}

    const stock = await odata.get({ url, username, password });
    
    // draft.response.body.push(stock['d']['results']);
    draft.pipe.json.stock = stock['d']['results'];
    
}