module.exports = async (draft, context) => {
  draft.response.body = [];
  const request = context.request;
  const queryString = request.params;
  const date = new Date().toJSON();
  const searchdate = queryString.searchdate
    ? queryString.searchdate
    : date.split("T")[0].split("-").join("");
  const odata = await context.odata.get({
    url: [
      "https://odata.bsg.support/dev/KEXIM_EXCH_RATE",
      `?$filter=BASIC_DATE eq '${searchdate}' and BASIC_SEQ eq 1`,
    ].join(""),
    headers: {
      "bsg-support-partnerID": "7na1k6mtgy",
      "bsg-support-systemID": "wk79tmdlvu",
      "bsg-support-systemExternalID": "my341545",
    },
  });

  const scheduleList = await context.odata.get({
    url: ["https://odata.bsg.support/dev/EXCH_SCHEDULE"].join(""),
    headers: {
      "bsg-support-partnerID": "7na1k6mtgy",
      "bsg-support-systemID": "wk79tmdlvu",
      "bsg-support-systemExternalID": "my341545",
    },
  });

  draft.pipe.json.exchange = {
    searchdate,
    odata: odata.d.results,
    scheduleList: scheduleList.d.results,
  };
};
