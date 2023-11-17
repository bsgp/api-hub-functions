module.exports = async (draft, { request, task }) => {
  // const never = "0 0 * * ? 9999";

  // 5am
  const oneTime = "0 20 * * ? *";

  const seqNumList = [
    {
      InterfaceId: "IF-CO-010",
      Data: {},
      Function: {
        Name: "OEFSACCTSETUP_LOG",
      },
      cron: oneTime,
      flowName: "if_db",
    },
    {
      InterfaceId: "IF-CO-011",
      Data: {
        // I_DATE: "20221101"
      },
      Function: {
        Name: "OEPROFITLOSS_GDRA_LOG",
      },
      cron: oneTime,
      flowName: "if_db",
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
      item.flowName,
      request.stage,
      item.cron || oneTime,
      {
        InterfaceId: IF_ID,
        Data: item.Data,
        Function: {
          UserId: "EAI Batch",
          UserText: "EAI Batch",
          SysId: "EAI",
          Type: "API",
          ...item.Function,
        },
      }
    );
    draft.response.body[taskId] = result;
  }
};
