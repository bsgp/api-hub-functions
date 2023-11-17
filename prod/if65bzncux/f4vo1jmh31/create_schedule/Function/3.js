module.exports = async (draft, { request, task }) => {
  // const never = "0 0 * * ? 9999";

  // now
  const oneTime = "30 6 * * ? *";

  // first (11pm)
  const firstTime = "0 14 * * ? *";

  // second (11pm 10min)
  const secondTime = "10 14 * * ? *";

  // third (11pm 20min)
  const thirdTime = "20 14 * * ? *";

  // cron: "0 0/1 * * ? *",
  // cron: "0 17 L,1-9 * ? *",

  const seqNumList = [
    {
      InterfaceId: "IF-CO-010-BATCH",
      Data: {},
      Function: {
        Name: "ZCO_IF_HR_DEPT",
      },
      cron: firstTime,
      flowName: "if_gpro",
    },
    {
      InterfaceId: "IF-CO-011-BATCH",
      Data: {},
      Function: {
        Name: "ZCO_IF_HR_EMPLOYEE",
      },
      cron: secondTime,
      flowName: "if_gpro",
    },
    {
      InterfaceId: "IF-CO-035-BATCH",
      Data: {},
      Function: {
        Name: "ZCO_IF_HR_EMPLOYEE_ORDER",
      },
      cron: thirdTime,
      flowName: "if_gpro",
    },
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
      item.flowName,
      request.stage,
      item.cron || oneTime,
      {
        InterfaceId: IF_ID,
        Data: item.Data,
        Function: {
          UserId: "EAI_Batch",
          UserText: "EAI Batch",
          SysId: "EAI",
          Type: "API-RFC",
          ...item.Function,
        },
      }
    );
    draft.response.body[taskId] = result;
  }
};
