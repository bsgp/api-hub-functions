module.exports = async (draft, { sql, file }) => {
  const { table, exchange } = draft.pipe.json;
  const [year, month, date] = exchange.searchDate;
  const [hour, minute, second] = exchange.searchTime;

  if (exchange.data.length === 0) {
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: "no Exchange data",
    };
    draft.response.statusCode = 200;
  }

  const builder = sql("mysql");
  const validator = await builder.validator(table);

  let validResult = true;
  let message = "";
  const exchangeData = exchange.data.map((item) => {
    // insert Data
    const convItem = {
      BASIC_DATE: `${year}${month}${date}`,
      BASIC_SEQ: `${Number(hour) - 1}`.padStart(2, "0"),
      CURR_CD: item.cur_unit,
      BASIC_TIME: `${Number(hour) + 9}${minute}${second}`.padStart(6, "0"),
      BASIC_RATE: item.deal_bas_r,
      RESULT: `${item.result}`,
      CURR_NAME: item.cur_nm,
      TT_SELL_RATE: item.tts,
      TT_BUY_RATE: item.ttb,
      BKPR: item.bkpr,
      YY_EFEE_R: item.yy_efee_r,
      TEN_DD_EFEE_R: item.ten_dd_efee_r,
      KFTC_BKPR: item.kftc_bkpr,
      KFTC_BASIC_RATE: item.kftc_deal_bas_r,
      SENDER: "",
      LAST_SENDER: "",
    };
    if (!validator(convItem).isValid) {
      validResult = false;
      message = validator(convItem).errorMessage;
    }
    return convItem;
  });

  if (!validResult) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: message,
      exchangeData,
    };
    draft.response.statusCode = 400;
    return;
  }

  let isSavedAll = true;
  const results = [];
  await Promise.all(
    exchangeData.map(async (data) => {
      const query = builder.insert(table, data);
      const result = await query.run();
      if (result.statusCode !== 200) {
        isSavedAll = false;
      }
      results.push(result);
    })
  );

  if (isSavedAll) {
    const savePath = [
      `/exchange/payload/${year}/${month}/${date}`,
      `/${exchangeData[0].BASIC_SEQ}.txt`,
    ].join("");
    const payloadString = JSON.stringify(exchangeData);
    const buf = Buffer.from(payloadString, "utf8").toString();
    await file.upload(savePath, buf, { gzip: true });
  }

  if (isSavedAll) {
    const date = exchangeData[0].BASIC_DATE;
    const seq = exchangeData[0].BASIC_SEQ;
    const queryEXCHG = sql().select(table);
    queryEXCHG.where("BASIC_DATE", "like", date);
    queryEXCHG.where("BASIC_SEQ", "like", seq);
    const resultEXCHG = await queryEXCHG.run();
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: `saved: ${date}, ${seq}`,
      result: resultEXCHG.body,
    };
  } else {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "some data Failed Save.",
      results,
    };
    draft.response.statusCode = 400;
    return;
  }
};
