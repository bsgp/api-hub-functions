module.exports = async (draft, context) => {
  const exchange = draft.pipe.json.exchange;
  if (exchange.searchdate && Array.isArray(exchange.odata)) {
    const date = new Date().toJSON();
    const time = date.split("T")[1];
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const second = time.split(":")[2].substr(0, 2);
    const payload = exchange.odata.map((item) => {
      return {
        BASIC_DATE: exchange.searchdate,
        BASIC_SEQ: Number(hour) - 1,
        CURR_CD: item.cur_unit,
        RESULT: item.result,
        CURR_NAME: item.cur_nm,
        BASIC_TIME: `${Number(hour) + 9}${minute}${second}`,
        BASIC_RATE: item.deal_bas_r,
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
    });
    if (Number(hour) > 1 && Number(hour) < 9) {
      // 11시 이후에 수출입은행 DATA 오픈
      // 11~17시까지 값 업데이트
      try {
        const headers = {
          "bsg-support-partnerID": "7na1k6mtgy",
          "bsg-support-systemID": "wk79tmdlvu",
          "bsg-support-systemExternalID": "my341545",
        };
        const getUrl = (stage) =>
          `https://odata.bsg.support/${stage}/KEXIM_EXCH_RATE`;
        await Promise.all(
          payload.map(async (body) => {
            await context.odata.post({ headers, url: getUrl("dev"), body });
            await context.odata.post({ headers, url: getUrl("staging"), body });
          })
        );

        draft.response.body = {
          body: { result: "success", odata: payload },
        };
      } catch (err) {
        draft.response.body = { error: "error occurred" };
      }
    }
  } else {
    draft.response.body = { error: exchange };
  }
};
