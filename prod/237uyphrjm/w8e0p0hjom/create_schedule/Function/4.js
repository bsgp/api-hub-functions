var utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

module.exports = async (draft, { request, lib }) => {
  const { dayjs } = lib;
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const kst = dayjs(request.requestTimeUTC).tz("Asia/Seoul");
  draft.response.body = {
    kst: kst.format("YYYY-MM-DDTHH:mm:ss"),
    utc: request.requestTimeUTC,
  };
  // your script
};
