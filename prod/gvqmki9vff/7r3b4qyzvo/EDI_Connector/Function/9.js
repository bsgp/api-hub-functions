module.exports = async (draft, { file }) => {
    const https = require('https');

	draft.response.body = [];

let nowDateTime = new Date().getTime();
nowDateTime += 60 * 60 * 1000; //영국 시간을 위해 + 1시간
nowDateTime = new Date(nowDateTime);

const ymd = nowDateTime.getFullYear().toString() + paddingZero((nowDateTime.getMonth() +1).toString(),2,0)  + paddingZero(nowDateTime.getDate().toString(),2,0);
const ymdhm = ymd + paddingZero(nowDateTime.getHours().toString(),2,0) + paddingZero(nowDateTime.getMinutes().toString(),2,0);

    const postData = JSON.stringify(
        {
            "ID": "id7",
            "CustomerOrderNumber": "20210622",
            "ExecutionDate": ymdhm,
            "GLNCode": "1234567890123",
            "DetailUrl": "설명란으로 바꿔야 할거같아... iHub 변경되서 브라우저 url로 호출 불가" 
        }
    ).toString();
    
    // const postData = 
    //     '{'
    //     +'    // "ID": "id1",'
    //     +'    "CustomerOrderNumber": "20210622",'
    //     +'    "ExecutionDate": ymdhm,'
    //     +'    "GLNCode": "1234567890123",'
    //     +'    "DetailUrl": "설명란으로 바꿔야 할거같아... iHub 변경되서 브라우저 url로 호출 불가" '
    //     +'}'
    
    const username = 'bsg1';
    const password = '1234';

    const idNpw = username + ":" + password;

    const options = {
        hostname: 'my356725.sapbydesign.com',
        port: 443,
        path: '/sap/byd/odata/cust/v1/bsg_edi_log/EDIErrorLogCollection',
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': 'Basic ' + new Buffer.alloc(Buffer.byteLength(idNpw) ,idNpw).toString("base64")
      }
    };

    
    function getPromise(opt){
        return new Promise(function(resolve, reject) {
            const req = https.request(opt, function(res){
                let body ='';  
                
                res.on('data', function(d){
                    body += d.toString();
                    // draft.response.body.push(body);
                    // console.log(d.toString());
                });
                
                res.on('end', function(){
                    draft.response.body.push(body);
                    resolve(body);
                });
                
                res.on('error', function(e){
                   reject(e);
                   draft.response.body.push(e)
                });
            
            })
            // .end();  // .end() req.end() 둘다 가능
            draft.response.body.push(postData);
            req.write(postData);
            req.end();
        });
    }
    
    
    async function req_call(){
        try {
            let http_promise = await getPromise(options);
            // let response_body = await http_promise;
            draft.response.body.push(http_promise);
        } catch (e) {
            draft.response.body.push(e);
        }
        
    }
    
    req_call();    

function paddingZero (str, SpadCnt, EpadCnt ){
    let a = str.split('.');
    str = a[0].padStart(SpadCnt, '0')
    return str;
}

}