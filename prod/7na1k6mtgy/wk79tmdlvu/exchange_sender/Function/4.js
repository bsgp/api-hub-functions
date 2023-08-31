module.exports = async (draft) => {
  const exchange = draft.pipe.json.exchange;
  // draft.response.body.push(exchange);
  const sortSchedule = exchange.scheduleList.sort(
    (a, b) => Number(b.POST_DATE) - Number(a.POST_DATE)
  );
  const latestSchedule = sortSchedule[0];
  const covPayload = exchange.odata
    .map((excItem) => {
      const curr_cd = excItem.CURR_CD.slice(0, 3);
      const SourceCurrencyCode = curr_cd === "CNH" ? "CNY" : curr_cd;
      if (SourceCurrencyCode !== "KRW") {
        const date = [
          excItem.BASIC_DATE.substr(0, 4),
          excItem.BASIC_DATE.substr(4, 2),
          excItem.BASIC_DATE.substr(6, 2),
        ].join("-");
        const time = [
          excItem.BASIC_TIME.substr(0, 2),
          excItem.BASIC_TIME.substr(2, 2),
          excItem.BASIC_TIME.substr(4, 2),
        ].join(":");
        const rate = excItem.BASIC_RATE.replace(/,/g, "");
        return {
          actionCode: "01",
          TypeCode: "001",
          SourceCurrencyCode,
          TargetCurrencyCode: "KRW",
          BidRate: rate,
          MidRate: rate,
          AskRate: rate,
          ValidFromDateTime: `${date}T${time}.000Z`,
        };
      }
    })
    .filter(Boolean);

  const payload =
    latestSchedule.SEND_TYPE === "ALL"
      ? covPayload
      : covPayload.filter((payload) => {
          const SourceCurrencyCode = payload.SourceCurrencyCode;
          if (SourceCurrencyCode === "CNY") {
            return latestSchedule.SOURCE_CURRENCY.includes("CNY");
          } else
            return latestSchedule.SOURCE_CURRENCY.includes(SourceCurrencyCode);
        });

  draft.response.body.push(latestSchedule);
  draft.pipe.json.exchange.ExchangeRate = payload;
};
