module.exports = async (draft, { odata }) => {
    
    const isTest = false;
    
    draft.response.body = [];
    
    let url;
    let username;
    let password;
    
    let glnCode = '5013546119636';
    let EANcode = '3574660575507'
    
    
    if(isTest){
        url = `https://my356725.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPZ899C24A65C125D8B8F4A7FQueryResults?$select=CQUANTITY_TYPE_CODE,CGTIN,CMATR_INT_ID,TMATR_INT_ID&$filter=(CGTIN%20eq%20%27${EANcode}%27)&$format=json`
        
        username = 'bsg1';
        password = '1234';
    }else{
        url = `https://my357084.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPZ41348B656183854B13B242QueryResults?$select=CQUANTITY_TYPE_CODE,CGTIN,CMATR_INT_ID,TMATR_INT_ID&$filter=(CGTIN%20eq%20%27${EANcode}%27)&$format=json`;
        
        username = 'bsg';
        password = '4321';
    }
    
    const material = await odata.get({ url, username, password });
    
    // draft.response.body.push(material);
    draft.response.body.push(material.d.results['0'].CGTIN); //ean코드
    draft.response.body.push(material.d.results['0'].CMATR_INT_ID); //자재코드
    draft.response.body.push(material.d.results['0'].TMATR_INT_ID); //자재명
    draft.response.body.push(material.d.results['0'].CQUANTITY_TYPE_CODE); //단위(EA, BOX)
    //자재 odata 테스트 끝
    
    
    if(isTest){
        url = `https://my356725.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPZFB23C649C7ABFE7A390973QueryResults?$select=CBP_UUID,CGLN_ID&$filter=(CGLN_ID%20eq%20%27${glnCode}%27)&$format=json`; //5013546119636
        username = 'bsg1';
        password = '1234';
    }else{
        url = `https://my357084.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPZFB0E99AA3B329041AA01EFQueryResults?$select=CBP_UUID,CGLN_ID&$filter=(CGLN_ID%20eq%20%27${glnCode}%27)&$format=json`;
        
        username = 'bsg';
        password = '4321';
    }
    
    const customer = await odata.get({ url, username, password });
    
    // draft.response.body.push(customer);
    draft.response.body.push(customer.d.results['0'].CBP_UUID); //byd 고객 코드
    draft.response.body.push(customer.d.results['0'].CGLN_ID); //gln코드
}