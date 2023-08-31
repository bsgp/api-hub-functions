module.exports = async (draft, { request, task }) => {
  const seqNumList = [
    // { ifId: "IF_GW003", scheduleId: "if_gw003", dbTable: "orgdept" },
    // { ifId: "IF_GW004", scheduleId: "if_gw004", dbTable: "orgjobposition" },
    // { ifId: "IF_GW005", scheduleId: "if_gw005", dbTable: "orgjobtitle" },
    // { ifId: "IF_GW006", scheduleId: "if_gw006", dbTable: "orgperson" },
    {
      ifId: "IF_HR005",
      scheduleId: "if_hr005",
      dbTable: "PW_IF_SIGN_GW_T",
      cron: "0 17 * * ? *",
    },
    {
      ifId: "IF_HR006",
      scheduleId: "if_hr006",
      dbTable: "PW_IF_EDUTRIP_GW_T",
      cron: "0/30 * * * ? *",
    },
  ];

  for (let idx = 0; idx < seqNumList.length; idx += 1) {
    const item = seqNumList[idx];
    const IF_ID = item.ifId;
    const result = await task.addSchedule(
      [item.scheduleId, request.stage].join("-"),
      "ghr",
      request.stage,
      item.cron || "30 16 * * ? *",
      {
        InterfaceId: IF_ID,
        DbTable: item.dbTable,
      }
    );
    draft.response.body[IF_ID] = result;
  }
};
