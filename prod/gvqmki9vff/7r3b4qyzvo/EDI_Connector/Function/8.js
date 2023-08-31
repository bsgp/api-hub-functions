module.exports = async (draft, { file }) => {
    const https = require('https');

	draft.response.body = [];

    const postData = JSON.stringify(
        {'msg' : 'sended message22' }
    ).toString() ;
    
    const options = {
        hostname: 'api.bsg.support',
        port: 443,
        path: '/scheduler?s=7r3b4qyzvo&p=gvqmki9vff&e=dev&u=3pl&k=WkNimSqbMI',
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
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
                    // console.log(body);
                    resolve(body);
                });
                
                res.on('error', function(e){
                   reject(e); 
                });
            
            })
            // .end();  // .end() req.end() 둘다 가능
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
            // console.log(e);
        }
        
    }
    
    req_call();    
    
    
    
    
    /*
    	//파일 리스트 받아오기
    
    // 	const result = await file.list('/custom/FROM_OpenText/');  //배열로 받아옴
    // 	draft.response.body = result;
    // 	draft.response.body = Object.keys(result);
    
    */
    // draft.response.body.push(postData);
    await file.get('/timeTest/time.txt', {gziped : true }).then((txt) => {
    	    draft.response.body.push(txt);
        }).catch((err) => {
            draft.response.body.push(err);
        })

}