module.exports = async (draft, { odata }) => {
    draft.response.body = [];
    
const https = require('https');
const username = 'bsg1';
const password = '1234';

const idNpw = username + ":" + password;

let nowDateTime = new Date();

const ymd = nowDateTime.getFullYear().toString() + paddingZero((nowDateTime.getMonth() +1).toString(),2,0)  + paddingZero(nowDateTime.getDate().toString(),2,0);
const ymdhm = ymd + paddingZero(nowDateTime.getHours().toString(),2,0) + paddingZero(nowDateTime.getMinutes().toString(),2,0);
let ISOnowtime = new Date(nowDateTime).toISOString();
// draft.response.body.push(ISOnowtime);

const postData = JSON.stringify(
    {"ID": ymdhm,
    "CustomerOrderNumber": ymd,
    "ExecutionDate": ISOnowtime,
    "GLNCode": "1234567890123",
    "CustomerName" : 'savers',
    "Description": "모듈화가 안되서 그냥 테스트33" }
).toString() ;

let token;
let cookie;
let optionsP; 
const hostname = 'my356725.sapbydesign.com';
const port = 443;
const path = '/sap/byd/odata/cust/v1/bsg_edi_log/EDIErrorLogCollection';
const Authorization = 'Basic ' + new Buffer.alloc(Buffer.byteLength(idNpw) ,idNpw).toString("base64");

const options = {
    hostname: hostname,
    port: port,
    path: path,
    method: 'GET',
    headers: {
        // 'Content-Type': 'application/json',
        // 'Content-Length': Buffer.byteLength(postData),
        'Authorization': Authorization,
        'X-CSRF-Token' : 'Fetch',
      }
};


function getPromise(opt){
    return new Promise(function(resolve, reject) {
        const req = https.request(opt, function(res){
            // draft.response.body.push(`HEADERS: ${JSON.stringify(res.headers)}`);
            if(opt.method == 'GET'){
                let headers = res.headers;
                // draft.response.body.push(typeof(headers));
                token = headers["x-csrf-token"];
                cookie = headers['set-cookie'];

                optionsP = {
                    hostname: hostname,
                    port: port,
                    path: path,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData),
                        'Authorization': Authorization,
                        'X-CSRF-Token' : token,
                        'Cookie' : cookie
                      }
                };

                // draft.response.body.push(token);
            }
            let body ='';  
            
            res.on('data', function(d){
                body += d.toString();
                // draft.response.body.push(body);
            });
            
            res.on('end', function(){
                // draft.response.body.push(body);
                resolve(body);
            });
            
            res.on('error', function(e){
               reject(e); 
            });
        
        })
        
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
          });
          
          // Write data to request body
        if(req.method == 'POST'){
            req.write(postData);
        }
        req.end();
    });
}


async function req_call(){
    try {
        let http_promise = await getPromise(options);
        // let response_body = await http_promise;
        // draft.response.body.push(optionsP);
        await req_call2();
        // console.warn(response_body);
        // draft.response.body.push(http_promise);
    } catch (e) {
        draft.response.body.push(e);
    }
    
}

// draft.response.body.push(postData);

await req_call();

async function req_call2(){
    try {
        let http_promise = await getPromise(optionsP);
        // let response_body = await http_promise;
        
        // console.warn(response_body);
        draft.response.body.push(http_promise);
    } catch (e) {
        draft.response.body.push(e);
    }
    
}

// draft.response.body.push(postData);

function paddingZero (str, SpadCnt, EpadCnt ){
    let a = str.split('.');
    str = a[0].padStart(SpadCnt, '0')
    return str;
}

	
}
