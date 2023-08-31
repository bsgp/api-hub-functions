module.exports = async (draft, { request, env, odata, sql, kst }) => {
  const setFailedRes = (msg, statusCode = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = statusCode;
  };

  const mysql = sql("mysql");

  const { KW_URL, CARD_DATA_ENDPOINT, KW_TOKEN, CHANNEL, CORP_BIZ_NO } = env;
  // const KW_URL = "https://datahub-dev.scraping.co.kr";
  // const CARD_DATA_ENDPOINT = "eProof/API/CARD/GetCardPremiumApprList";
  // const KW_TOKEN = "Token 49e7367d07e54aa6bcc82f7370b4eaf37430511d";
  // const CHANNEL = "DEMO";
  // const CORP_BIZ_NO = "1119911111";

  const reqBody = {
    CHANNEL: CHANNEL,
    CORP_BIZ_NO: CORP_BIZ_NO,
    ST_DT: request.body.ST_DT || kst.add(-1, "day").format("YYYYMMDD"),
    ED_DT: request.body.ED_DT || kst.format("YYYYMMDD"),
    PAGE_SIZE: 1000,
    PAGE_NO: request.body.PAGE_NO || 1,
  };

  const responseData = {
    reqBody,
    results: [],
  };
  let shouldContinue = true;

  try {
    while (shouldContinue) {
      const tempCardInfo = await odata.post({
        url: [KW_URL, CARD_DATA_ENDPOINT].join("/"),
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: KW_TOKEN,
        },
        body: reqBody,
      });
      responseData.tempCardInfo = tempCardInfo;

      // errCode 가 "0000" 아닌 경우 throw
      if (tempCardInfo.errCode !== "0000") {
        throw new Error("Failed to fetch data");
      }
      // 조회는 되는데 잘못된 조회가 이루어질 경우 throw
      if (tempCardInfo.data.RTN !== "SUCCESS") {
        throw new Error(tempCardInfo.data.ERR_MSG);
      }

      // 불러온 데이터가 비어있는 경우 나가기
      if (tempCardInfo.data.LIST.length === 0) {
        shouldContinue = false;
        break;
      }

      // 작업할 내용...
      const resultOfInsert = await mysql
        .insert("CMS_CORP_CARD_APRV_01", tempCardInfo.data.LIST)
        .onConflict(["HIST_ROW_KEY"])
        .ignore()
        .run();
      responseData.results.push(resultOfInsert);

      // 다음 차례가 없으면 나가기
      if (tempCardInfo.data.IS_NEXT === "N") {
        shouldContinue = false;
        break;
      }

      // 다음 차례가 존재하면 인덱스 업데이트
      reqBody.PAGE_NO += 1;
    }
  } catch (e) {
    setFailedRes(e.message, 500);
    return;
  }

  draft.response.body = responseData;
};

// function dateToString(dateObj, separation = "") {
//   if (!dateObj) {
//     dateObj = new Date();
//   }
//   const year = dateObj.getFullYear().toString();
//   const month = `000${dateObj.getMonth() + 1}`.slice(-2);
//   const date = `000${dateObj.getDate()}`.slice(-2);

//   return [year, month, date].join(separation);
// }

/*
{
  "errCode": "0000",
  "errMsg": "success",
  "result": "SUCCESS",
  "data": {
    "RTN": "SUCCESS",
    "ERR_CODE": "KH_COM_0001",
    "ERR_MSG": "조회내역이 없습니다.",
    "PAGE_SIZE": 1000,
    "PAGE_NO": 1,
    "ROW_CNT": 0,
    "PAGE_TOT_CNT": 0,
    "ROW_TOT_CNT": 0,
    "IS_NEXT": "N",
    "NEXT_PAGE_NO": 2,
    "LIST": []
  }
}
*/

/*
{
  "errCode": "0000",
  "errMsg": "success",
  "result": "SUCCESS",
  "data": {
    "RTN": "FAIL",
    "ERR_CODE": "KH_COM_3001",
    "ERR_MSG": "필수입력항목이 입력되지 않았습니다.[ED_DT]"
  }
}
*/

/*
module.exports = async (draft, { request, odata }) => {
  const { URL, CHANNEL, CORP_BIZ_NO, KW_TOKEN } = draft.json;

  const ST_DT = request.body && request.body.ST_DT;
  const ED_DT = request.body && request.body.ED_DT;
  if (!ST_DT || !ED_DT) {
    draft.response.body = { status: "F", message: "wrong date" };
    return;
  }

  const kw_response = await odata.post({
    url: URL,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: KW_TOKEN,
    },
    body: { CHANNEL, CORP_BIZ_NO, ST_DT, ED_DT },
  });

  if (!kw_response || kw_response.errCode !== "0000") {
    draft.response.body = { status: "F", message: "failed fetch api" };
  } else {
    const { data, ...args } = kw_response;
    const { LIST, ...dataArgs } = data;
    draft.response.body = {
      data: { ...args, ...dataArgs },
      result: LIST.map((item) => ({ ...item })),
      cardNum: LIST.map((item) => item.CARD_NO).filter(
        (item, idx) => LIST.findIndex((data) => data.CARD_NO === item) === idx
      ),
    };
  }
};
*/
