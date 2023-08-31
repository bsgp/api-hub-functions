// var utc = require("dayjs/plugin/utc");
// const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

module.exports = async (draft, { request, task }) => {
  //   const { dayjs } = lib;
  // dayjs.extend(utc);
  // dayjs.extend(timezone);

  // const kst = dayjs(request.requestTimeUTC).tz("Asia/Seoul");
  // const never = "0 0 * * ? 9999";

  const perHour = "0 0/1 * * ? *";
  // "50 0/1 * * ? *";

  // const perHour2 =
  //   request.stage === "prod" ? "20 0/1 * * ? *" : "10 0/1 * * ? *";

  // at 9am, 17, 2am
  // const threeTimes =
  //   request.stage === "prod" ? "0 0,8,17 * * ? *" : "50 7,16,23 * * ? *";

  // 9am
  const oneTime = "0 0 * * ? *";

  // 6pm, 6am
  const twoTimes = "0 9,21 * * ? *";

  // 14시, 18시, 20시, 02시, 08시
  // const fiveTimes =
  //   request.stage === "prod"
  //     ? "0 5,9,11,17,23 * * ? *"
  //     : "50 4,8,10,16,22 * * ? *";

  const seqNumList = [
    // ...["1000", "5000", "6000"].map((bukrs) => ({
    //   TaskIdSuffix: bukrs,
    //   InterfaceId: "IF-CO-001",
    //   Data: {
    //     I_BUKRS: bukrs,
    //     // I_SPMON: "LAST_YEAR_MONTH"
    //   },
    // })),
    {
      InterfaceId: "IF-GHR-001",
      Data: {},
      cron: oneTime,
    },
    {
      InterfaceId: "IF-GHR-002",
      Data: {},
      cron: oneTime,
    },
    {
      InterfaceId: "IF-GHR-003",
      Data: {},
      cron: oneTime,
    },
    {
      InterfaceId: "IF-GHR-004",
      Data: {},
      cron: oneTime,
    },
    {
      InterfaceId: "IF-SD-020",
      Data: {
        I_VKORG: "1000",
        // I_FROM: "202210",
        // I_TO: "202211"
      },
      cron: twoTimes,
    },
    {
      InterfaceId: "IF-PP-002",
      Data: {
        // "I_DATE_F": "20221201",
        // "I_DATE_T": "20230104"
      },
      cron: twoTimes,
    },
    // cron: "0 0/1 * * ? *",
    // cron: "0 17 L,1-9 * ? *",
  ].concat(
    [false, true]
      .map((prev) => [
        {
          InterfaceId: "IF-FI-007",
          TaskIdSuffix: prev ? "prev" : null,
          Data: {
            prev,
            I_BUKRS: "1000",
            // "I_SPMON": "202211"
          },
          cron: twoTimes,
        },
        {
          InterfaceId: "IF-CO-007",
          TaskIdSuffix: prev ? "prev" : null,
          Data: {
            prev,
            I_BUKRS: "1000",
            // "I_SPMON": "202211"
          },
          cron: twoTimes,
        },
        {
          InterfaceId: "IF-CO-008",
          TaskIdSuffix: prev ? "prev" : null,
          Data: {
            prev,
            I_BUKRS: "1000",
            // "I_SPMON": "202211"
          },
          cron: twoTimes,
        },
        {
          InterfaceId: "IF-MM-011",
          TaskIdSuffix: prev ? "prev" : null,
          Data: {
            prev,
            I_BUKRS: "1000",
            // "I_DATE": "20221101"
          },
          cron: twoTimes,
        },
      ])
      .flat()
  );

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
