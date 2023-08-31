module.exports = async (draft, { request }) => {

const isFirst = true;
	
let nowDateTime = new Date().getTime();
nowDateTime += 60 * 60 * 1000; //영국 시간을 위해 + 1시간
nowDateTime = new Date(nowDateTime);

const ymd = nowDateTime.getFullYear().toString() + paddingZero((nowDateTime.getMonth() +1).toString(),2,0)  + paddingZero(nowDateTime.getDate().toString(),2,0);
const ymdhm = ymd + paddingZero(nowDateTime.getHours().toString(),2,0) + paddingZero(nowDateTime.getMinutes().toString(),2,0);


let stockXml;

//header
let hIDENTIFIER = 'H';
let INTERFACE_ID = ymdhm + paddingZero(nowDateTime.getSeconds().toString(),2,0) +'LGUKBYD';
let TRANSACTION_FLAG;

if(isFirst){
    TRANSACTION_FLAG = 'I';
}else{
    TRANSACTION_FLAG = 'U';
}

let CREATE_DATE = ymdhm;

const WERKS = draft.pipe.json.stock[0].CSITE_UUID;
const BASE_DT = ymd;

tmplHeader = `<?xml version="1.0" encoding="UTF-8"?>`
        +`<Header>`
        +`  <senderID>5065004854016</senderID>`
        +`  <recieverID>687822338<recieverID>`
        +`  <DocumentType>b2bWM4845</DocumentType>`  //pantos에서 고정값으로 요청함
        +`  <IDENTIFIER>${hIDENTIFIER}</IDENTIFIER>`
        +`  <INTERFACE_ID>${INTERFACE_ID}</INTERFACE_ID>`
        +`  <WERKS>${WERKS}</WERKS>`
        +`  <BASE_DT>${BASE_DT}</BASE_DT>`
        // +`  <LGORT>${LGORT}</LGORT>`
        +`  <TRANSACTION_FLAG>${TRANSACTION_FLAG}</TRANSACTION_FLAG>`
        +`  <CREATE_DATE>${CREATE_DATE}</CREATE_DATE>`
        +`</Header>`;
	

    let Detail = '';
    let i;
    for(i = 0; i < draft.pipe.json.stock.length;i++ ){
        const stock = draft.pipe.json.stock[i];

    //Detail
    let dIDENTIFIER = 'D';
    
    let MATNR = stock.CMATERIAL_UUID;
    let QTY = stock.KCUN_RESTRICTED_STOCK; //제한 제외 재고 수량
    let RESTRICTED_QTY = stock.KCRESTRICTED_STOCK; //제한 수량
    let TotalQTY = stock.KCON_HAND_STOCK; // 총 재고수량

    tmplDetail = `<Detail>`
        +`  <IDENTIFIER>${dIDENTIFIER}</IDENTIFIER>`
        +`  <MATNR>${MATNR}</MATNR>`
        // +`  <STAUTS_CD>${STAUTS_CD}</STAUTS_CD>`
        +`  <QTY>${QTY}</QTY>`
        +`  <RESTRICTED_QTY>${RESTRICTED_QTY}</RESTRICTED_QTY>`
        //@@@총 재고수량
        +`</Detail>`;
        
        Detail += tmplDetail;
    }

    //Tail
    let tIDENTIFIER = 'T';
    let LINE_COUNT = i;
	

    tmplTail = `<Tail>`
        +`  <IDENTIFIER>${tIDENTIFIER}</IDENTIFIER>`
        +`  <LINE_COUNT>${LINE_COUNT}</LINE_COUNT>`
        +`</Tail>`;

stockXml = tmplHeader + Detail + tmplTail;


function paddingZero (str, SpadCnt, EpadCnt ){
    let a = str.split('.');
    str = a[0].padStart(SpadCnt, '0')
    // + a[1].padEnd(EpadCnt, '0');
    return str;
}

// draft.response.body.push(draft.pipe.json.stock.length);
// draft.response.body.push(stockXml);
draft.pipe.json.stock = stockXml;
}
