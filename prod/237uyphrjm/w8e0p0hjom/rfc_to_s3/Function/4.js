var utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

module.exports = async (draft, { request, env, lib }) => {
  const { dayjs } = lib;
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const kst = dayjs(request.requestTimeUTC).tz("Asia/Seoul");

  draft.json.connection = JSON.parse(
    env[`SAP_${env.CURRENT_ALIAS.toUpperCase()}`]
  );

  if (draft.json.ifObj.IsSapTable) {
    draft.json.nextNodeKey = "Function#12";
  } else {
    draft.json.nextNodeKey = "RFC#3";
  }

  if (request.method === "TASK") {
    switch (draft.json.ifId) {
      case "IF-SD-020":
        draft.json.parameters = {
          ...draft.json.parameters,
          I_FROM: kst.subtract(1, "months").startOf("month").format("YYYYMM"),
          I_TO: kst.format("YYYYMM"),
          // FKDAT: [
          //   kst.subtract(1, "months").startOf("month").format("YYYYMMDD"),
          //   kst.format("YYYYMMDD"),
          // ],
        };
        break;
      case "IF-FI-007":
      case "IF-CO-007":
      case "IF-CO-008":
      case "IF-MM-011":
        if (draft.json.parameters.prev) {
          draft.json.parameters = {
            ...draft.json.parameters,
            I_SPMON: kst.subtract(1, "months").format("YYYYMM"),
          };
        } else {
          draft.json.parameters = {
            ...draft.json.parameters,
            I_SPMON: kst.format("YYYYMM"),
          };
        }
        delete draft.json.parameters.prev;
        break;
      case "IF-PP-002":
        draft.json.parameters = {
          ...draft.json.parameters,
          I_DATE_F: kst
            .subtract(1, "months")
            .startOf("month")
            .format("YYYYMMDD"),
          I_DATE_T: kst.format("YYYYMMDD"),
          // FKDAT: [
          //   kst.subtract(1, "months").startOf("month").format("YYYYMMDD"),
          //   kst.format("YYYYMMDD"),
          // ],
        };
        break;
      default:
        break;
    }
  }
  // draft.json.funcname = "Z_PP_AWS_CONF_D";
  // draft.json.parameters = {
  //   I_BUDAT_LOW: "20220501",
  //   I_BUDAT_HIGH: "20220720",
  //   I_WERKS: "5100",
  // };

  // draft.json.funcname = "Z_PP_AWS_CONF_M";
  // draft.json.parameters = {
  //   I_SPMON_LOW: "202106",
  //   I_SPMON_HIGH: "202107",
  //   I_WERKS: "5100",
  // };
};
