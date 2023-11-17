// var utc = require("dayjs/plugin/utc");
// const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

module.exports = async (draft, { request, task }) => {
  //   const { dayjs } = lib;
  // dayjs.extend(utc);
  // dayjs.extend(timezone);

  // const kst = dayjs(request.requestTimeUTC).tz("Asia/Seoul");
  const never = "0 0 * * ? 9999";

  const perHour = request.stage === "prod" ? "0 0/1 * * ? *" : "50 0/1 * * ? *";

  const perHour2 =
    request.stage === "prod" ? "20 0/1 * * ? *" : "10 0/1 * * ? *";

  // at 9am, 17, 2am
  const threeTimes =
    request.stage === "prod" ? "0 0,8,17 * * ? *" : "50 7,16,23 * * ? *";

  // 2am
  const oneTime = "0 17 * * ? *";
  const oneTimeOnJan = "0 17 * 1 ? *";

  // 5am
  const oneTime5Am = "0 20 * * ? *";

  // 3am, 2pm
  const oneTime3Am2Pm = "0 5,18 * * ? *";

  // at 6pm, 6am
  const twoTimes = "0 9,22 * * ? *";

  // at 9am, 17
  const twoTimes2 = request.stage === "0 0,8 * * ? *";

  // 14시, 18시, 20시, 02시, 08시
  const fiveTimes =
    request.stage === "prod"
      ? "0 5,9,11,17,23 * * ? *"
      : "50 4,8,10,16,22 * * ? *";

  const seqNumList = [
    ...["1000", "5000", "6000"].map((bukrs) => ({
      TaskIdSuffix: bukrs,
      InterfaceId: "IF-CO-001",
      Data: {
        I_BUKRS: bukrs,
        // I_SPMON: "LAST_YEAR_MONTH"
      },
    })),
    {
      InterfaceId: "IF-MM-002",
      Data: {},
      cron: perHour,
    },
    {
      InterfaceId: "IF-MM-003",
      Data: {},
      cron: threeTimes,
    },
    {
      InterfaceId: "IF-MM-004",
      Data: {},
      cron: twoTimes2,
    },
    ...["5100", "5200", "6100"].map((werks) => ({
      TaskIdSuffix: werks,
      InterfaceId: "IF-PP-001",
      Data: {
        // I_BUDAT_LOW: "20220501",
        // I_BUDAT_HIGH: "20220720",
        I_WERKS: werks,
      },
      cron: perHour,
    })),
    ...["5100", "5200", "6100"].map((werks) => ({
      TaskIdSuffix: werks,
      InterfaceId: "IF-PP-002",
      Data: {
        // I_SPMON_HIGH: "202107", I_SPMON_LOW: "202106",
        I_WERKS: werks,
      },
      cron: perHour,
    })),
    ...["5100", "5200", "6100"].map((werks) => ({
      TaskIdSuffix: werks,
      InterfaceId: "IF-PP-003",
      Data: {
        // I_SPMON_HIGH: "202206", I_SPMON_LOW: "202201",
        I_WERKS: werks,
      },
      cron: oneTime,
    })),
    {
      InterfaceId: "IF-SD-001",
      Data: {}, //{ FKDAT: ["20220101", "20220201"] },
      FunctionName: "/SAPDS/RFC_READ_TABLE",
      cron: threeTimes,
    },
    {
      InterfaceId: "IF-SD-002",
      Data: {}, //{ FKDAT: ["20220101", "20220201"] },
      FunctionName: "/SAPDS/RFC_READ_TABLE",
      cron: threeTimes,
    },
    {
      InterfaceId: "IF-SD-003",
      Data: { I_TYPE: "Y", I_VRSIO: "220" }, // I_ZYEAR: "2022"
      cron: oneTime,
    },
    {
      InterfaceId: "IF-SD-004",
      Data: { I_TYPE: "1" }, // "I_SPMON": "202201"
      cron: twoTimes,
    },
    {
      InterfaceId: "IF-SD-004",
      TaskIdSuffix: "prev_month",
      Data: { I_TYPE: "1", prev: true }, // "I_SPMON": "202201"
      cron: twoTimes,
    },
    {
      InterfaceId: "IF-SD-003_2",
      Data: { I_TYPE: "M" },
      // I_ZYEAR:"2022",I_VRSIO:YYM,eg: "231","232",..."23X"(10월),"23Y"(11월)
      cron: oneTime,
    },
    {
      InterfaceId: "IF-SD-005",
      Data: { I_TYPE: "1" }, // I_ZYEAR: "2022"
      cron: oneTime,
    },
    {
      InterfaceId: "IF-SD-005",
      TaskIdSuffix: "prev",
      Data: { prev: true, I_TYPE: "1" }, // I_ZYEAR: "2022"
      cron: oneTimeOnJan,
    },
    {
      InterfaceId: "IF-SD-005_2",
      Data: { I_TYPE: "2" }, // I_ZYEAR: "2022"
      cron: oneTime,
    },
    {
      InterfaceId: "IF-SD-005_2",
      TaskIdSuffix: "prev",
      Data: { prev: true, I_TYPE: "2" }, // I_ZYEAR: "2022"
      cron: oneTimeOnJan,
    },
    {
      InterfaceId: "IF-WISH-001",
      Data: {},
      cron: never,
    },
    {
      InterfaceId: "IF-WISH-002",
      Data: {},
      cron: fiveTimes,
    },
    {
      InterfaceId: "IF-ENMS-001",
      Data: {},
      cron: oneTime,
    },
    {
      InterfaceId: "IF-EHR-001",
      Data: {},
      cron: perHour,
    },
    {
      InterfaceId: "IF-EHR-002",
      Data: {},
      cron: oneTime,
    },
    {
      InterfaceId: "IF-EHR-003",
      Data: {},
      cron: oneTime,
    },
    {
      InterfaceId: "IF-EHR-004",
      Data: {},
      cron: oneTime3Am2Pm,
    },
    {
      InterfaceId: "IF-EHR-004",
      TaskIdSuffix: "2",
      Data: { second: true },
      cron: oneTime5Am,
    },
    {
      InterfaceId: "IF-SECOM-001",
      Data: {},
      cron: perHour2,
    },
    // cron: "0 0/1 * * ? *",
    // cron: "0 17 L,1-9 * ? *",
  ];
  for (let idx = 0; idx < seqNumList.length; idx += 1) {
    const item = seqNumList[idx];
    const IF_ID = item.InterfaceId;
    const taskId = [IF_ID, item.TaskIdSuffix, request.stage]
      .filter(Boolean)
      .join("_")
      .toLowerCase();
    const result = await task.addSchedule(
      taskId,
      "rfc_to_s3",
      request.stage,
      item.cron || perHour,
      {
        InterfaceId: IF_ID,
        Data: item.Data,
        FunctionName: item.FunctionName,
      }
    );
    draft.response.body[taskId] = result;
  }
};
