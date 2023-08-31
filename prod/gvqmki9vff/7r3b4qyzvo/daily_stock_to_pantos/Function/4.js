module.exports = async (draft, { log }) => {
  const isTest = draft.pipe.json.isTest;

  const nowDateTime = new Date();
  // 서머타임 고려하지 않음.
  /*
  let nowDateTime = new Date().getTime();
  nowDateTime += 60 * 60 * 1000; //영국 시간을 위해 + 1시간 
  nowDateTime = new Date(nowDateTime);
  */
  function paddingZero(str, SpadCnt) {
    const a = str.split(".");
    str = a[0].padStart(SpadCnt, "0");
    // + a[1].padEnd(EpadCnt, '0');
    return str;
  }

  const ymd =
    nowDateTime.getFullYear().toString() +
    paddingZero((nowDateTime.getMonth() + 1).toString(), 2, 0) +
    paddingZero(nowDateTime.getDate().toString(), 2, 0);
  const ymdhm =
    ymd +
    paddingZero(nowDateTime.getHours().toString(), 2, 0) +
    paddingZero(nowDateTime.getMinutes().toString(), 2, 0);

  // header
  const hIDENTIFIER = "H";
  const INTERFACE_ID =
    ymdhm + paddingZero(nowDateTime.getSeconds().toString(), 2, 0) + "LGUKBYD";
  let TRANSACTION_FLAG;

  if (isTest) {
    TRANSACTION_FLAG = "I";
  } else {
    TRANSACTION_FLAG = "U";
  }

  const CREATE_DATE = ymdhm;

  const WERKS = draft.pipe.json.stock[0].CSITE_UUID;
  const BASE_DT = ymd;

  const tmplHeader =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<Header>` +
    `  <senderID>5065004854016</senderID>` +
    `  <recieverID>687822338</recieverID>` +
    `  <DocumentType>b2bWM4845</DocumentType>` + // pantos에서 고정값으로 요청함
    `  <IDENTIFIER>${hIDENTIFIER}</IDENTIFIER>` +
    `  <INTERFACE_ID>${INTERFACE_ID}</INTERFACE_ID>` +
    `  <WERKS>${WERKS}</WERKS>` +
    `  <BASE_DT>${BASE_DT}</BASE_DT>` +
    // +`  <LGORT>${LGORT}</LGORT>`
    `  <TRANSACTION_FLAG>${TRANSACTION_FLAG}</TRANSACTION_FLAG>` +
    `  <CREATE_DATE>${CREATE_DATE}</CREATE_DATE>` +
    `</Header>`;

  const Detail = [];
  const tmplDetail = (stock, quantity, statusCode) => {
    //statusCode 정상재고: 10 제한제고: 20
    const dIDENTIFIER = "D";
    const MATNR = stock.CMATERIAL_UUID;
    const TotalQTY = stock.KCON_HAND_STOCK; // 총 재고수량
    log(TotalQTY);
    return (
      `<Detail>` +
      `  <IDENTIFIER>${dIDENTIFIER}</IDENTIFIER>` +
      `  <MATNR>${MATNR}</MATNR>` +
      `  <STAUTS_CD>${statusCode}</STAUTS_CD>` +
      `  <QTY>${quantity}</QTY>` +
      `</Detail>`
    );
  };
  // Detail
  for (let idx = 0; idx < draft.pipe.json.stock.length; idx++) {
    const stock = draft.pipe.json.stock[idx];
    const QTY = Number(stock.KCUN_RESTRICTED_STOCK); // 제한 제외 재고 수량
    const RESTRICTED_QTY = Number(stock.KCRESTRICTED_STOCK); // 제한 수량
    if (QTY) {
      Detail.push(tmplDetail(stock, QTY, 10));
    }
    if (RESTRICTED_QTY) {
      Detail.push(tmplDetail(stock, RESTRICTED_QTY, 20));
    }
  }

  // Tail
  const tIDENTIFIER = "T";
  const LINE_COUNT = Detail.length;

  const tmplTail =
    `<Tail>` +
    `  <IDENTIFIER>${tIDENTIFIER}</IDENTIFIER>` +
    `  <LINE_COUNT>${LINE_COUNT}</LINE_COUNT>` +
    `</Tail>`;

  const stockXml = tmplHeader + Detail.join("") + tmplTail;

  // draft.response.body.push(draft.pipe.json.stock.length);
  draft.response.body.push(stockXml);
  draft.pipe.json.stock = stockXml;
};
