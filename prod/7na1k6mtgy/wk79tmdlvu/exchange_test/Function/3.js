module.exports = async (draft, context) => {
  // const { request, user, getUser, odata, soap,
  //        ftp, rfc, task, file, sql, env, lib, util, log } = context;
  // your script
  const request = context.request;
  const queryString = request.params;
  const date = new Date().toJSON();
  const currTime = date.slice(0, 19).split("T");
  const searchDate = queryString.searchdate
    ? queryString.searchdate
    : currTime[0].split("-");
  const searchTime = currTime[1].split(":");
  const data = await context.odata.get({
    url: [
      "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?",
      "authkey=BhVaU59fgi2UKPM8vlxDmjC0T9s9O81f", // valid 2 year (2023.04)
      `&searchdate=${searchDate.join("")}`,
      "&data=AP01",
    ].join(""),
  });

  draft.pipe.json.exchange = { searchDate, data, searchTime };
};
