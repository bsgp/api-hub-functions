module.exports = async (draft, { request, task }) => {
  const seqNumList = [
    { ifId: "IF_RM001", scheduleId: "if_rm001", dbTable: "TBSAP001" },
    { ifId: "IF_RM002", scheduleId: "if_rm002", dbTable: "TBSAP002" },
    { ifId: "IF_RM003", scheduleId: "if_rm003", dbTable: "TBSAP003" },
    {
      ifId: "IF_RM004",
      scheduleId: "if_rm004",
      dbTable: "TBSAP004",
      cron: "0 0/1 * * ? *",
    },
    { ifId: "IF_RM005", scheduleId: "if_rm005", dbTable: "TBSAP005" },
    { ifId: "IF_RM006", scheduleId: "if_rm006", dbTable: "TBSAP006" },
    { ifId: "IF_RM009", scheduleId: "if_rm009", dbTable: "TBSAP009" },
    { ifId: "CO-001", scheduleId: "co_001", dbTable: "TBSAP101" },
    {
      ifId: "PRM-143",
      scheduleId: "prm-143",
      dbTable: "TBSAP201",
      cron: "0 17 L,1-9 * ? *",
    },
  ];
  for (let idx = 0; idx < seqNumList.length; idx += 1) {
    const item = seqNumList[idx];
    const IF_ID = item.ifId;
    const result = await task.addSchedule(
      [item.scheduleId, request.stage].join("_"),
      "rms",
      request.stage,
      item.cron || "0 0/1 * * ? *",
      {
        InterfaceId: IF_ID,
        DbTable: item.dbTable,
        Meta: {
          I_UIDNT: "EAI",
          I_UTEXT: "EAI",
          I_SYSID: "RMS",
        },
      }
    );
    draft.response.body[IF_ID] = result;
  }
};
