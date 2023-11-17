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
      case "IF-SD-001":
      case "IF-SD-002":
        draft.json.parameters = {
          ...draft.json.parameters,
          I_FKDAT_FR: kst
            .subtract(1, "months")
            .startOf("month")
            .format("YYYYMMDD"),
          I_FKDAT_TO: kst.format("YYYYMMDD"),
          // FKDAT: [
          //   kst.subtract(1, "months").startOf("month").format("YYYYMMDD"),
          //   kst.format("YYYYMMDD"),
          // ],
        };
        break;
      case "IF-SD-003":
        {
          draft.json.parameters = {
            ...draft.json.parameters,
            I_ZYEAR: kst.format("YYYY"),
          };

          // if (draft.json.parameters.I_ZYEAR === "2023") {
          //   draft.json.parameters.I_VRSIO = "23A";
          // }
          draft.json.parameters.I_VRSIO = [kst.format("YY"), "A"].join("");

          // const prev = kst.subtract(1, "months").startOf("month");
        }
        break;
      case "IF-SD-004":
        {
          draft.json.parameters = {
            ...draft.json.parameters,
            I_SPMON: kst.format("YYYYMM"),
          };

          if (draft.json.parameters.prev === true) {
            const prev = kst.startOf("month").subtract(1, "months");
            draft.json.parameters.I_SPMON = prev.format("YYYYMM");
            delete draft.json.parameters.prev;
          }
        }
        break;
      case "IF-SD-003_2":
        {
          const prevMonthKst = kst.startOf("month").subtract(1, "months");
          const monthText = prevMonthKst.format("M");
          const yearTwoDigits = prevMonthKst.format("YY");
          const monthMap = {
            10: "X",
            11: "Y",
            12: "Z",
          };
          const pVrsio =
            monthText.length === 1
              ? [yearTwoDigits, monthText].join("")
              : [yearTwoDigits, monthMap[monthText]].join("");

          draft.json.parameters = {
            ...draft.json.parameters,
            I_VRSIO: pVrsio,
            I_ZYEAR: kst.format("YYYY"),
            I_ZMON: kst.format("MM"),
          };
        }
        break;
      case "IF-SD-005":
      case "IF-SD-005_2":
        {
          if (draft.json.parameters.prev) {
            draft.json.parameters = {
              ...draft.json.parameters,
              I_ZYEAR: kst.subtract(1, "years").format("YYYY"),
            };
          } else {
            draft.json.parameters = {
              ...draft.json.parameters,
              I_ZYEAR: kst.format("YYYY"),
            };
          }
          delete draft.json.parameters.prev;
        }
        break;
      case "IF-MM-004":
        draft.json.parameters = {
          ...draft.json.parameters,
          FDATE: kst.subtract(1, "months").startOf("month").format("YYYYMMDD"),
          TDATE: kst.format("YYYYMMDD"),
        };
        break;
      case "IF-PP-001":
        draft.json.parameters = {
          ...draft.json.parameters,
          I_BUDAT_LOW: kst
            .subtract(1, "months")
            .startOf("month")
            .format("YYYYMMDD"),
          I_BUDAT_HIGH: kst.format("YYYYMMDD"),
        };
        break;
      case "IF-PP-002":
      case "IF-PP-003":
        draft.json.parameters = {
          ...draft.json.parameters,
          I_SPMON_LOW: kst
            .subtract(1, "months")
            .startOf("month")
            .format("YYYYMM"),
          I_SPMON_HIGH: kst.format("YYYYMM"),
        };
        break;
      case "IF-CO-001":
        draft.json.parameters = {
          ...draft.json.parameters,
          I_SPMON: kst.subtract(1, "months").format("YYYYMM"),
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
