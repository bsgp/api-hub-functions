module.exports = async (draft, { file }) => {
	// restFul 요청
	const https = require('https');

// 	draft.response.body = [];

    // const postData = draft.pipe.json.material;
    const postData = draft.pipe.json.stock;
    
    // draft.response.body.push(postData);
    // draft.response.body.push(typeof(postData));  //string
    
    const username = 'LGHH';
    const password = 'LGHH';
    const idNpw = username + ":" + password;
    
    const agent = new https.Agent({
        keepAlive: true,
        maxSockets: 1
    });
    
    const options = {
        agent: agent,
        hostname: 'b2bqa.lxpantos.com',
        port: 5409,
        path: '/invoke/wm.tn/receive',
        method: 'POST',
        headers: {
        'Content-Type': 'text/xml',
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
                    draft.response.body.push(body);
                });
                
                res.on('end', function(){
                    draft.response.body.push(body);
                    resolve(body);
                });
                
                res.on('error', function(e){
                   draft.response.body.push(e);
                   reject(e); 
                });
            
            })
            // .end();  // .end() req.end() 둘다 가능
            req.on('error', (e) => {
                draft.response.body.push(e);
            });
            
            req.write(postData);
            req.end();
        });
    }
    
    
    async function req_call(){
        try {
            let http_promise = await getPromise(options);
            draft.response.body.push(http_promise.body);
            //성공 시 시간기록
	        const buf = Buffer.from(draft.pipe.json.fromtime, 'utf8').toString();
            file.upload('/send/material/pantos/regtime.txt', buf, {gzip:true});
        } catch (e) {
            draft.response.body.push(e);
        }
        
    }
    
    await req_call();
    draft.response.body.push('end');
}