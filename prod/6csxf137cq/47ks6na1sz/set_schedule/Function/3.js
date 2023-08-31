module.exports = async (draft, { request, task }) => {
  const seqNumList = [
    { ifId: "IF_001", scheduleId: "if_001" },
    { ifId: "IF_002", scheduleId: "if_002" },
    { ifId: "IF_003", scheduleId: "if_003" },
  ];
  for (let idx = 0; idx < seqNumList.length; idx += 1) {
    const item = seqNumList[idx];
    const IF_ID = item.ifId;
    const result = await task.addSchedule(
      [item.scheduleId, request.stage].join("_"),
      "eai_rfc_mes",
      request.stage,
      item.cron || "0/10 * * * ? 9999",
      {
        InterfaceId: IF_ID,
      }
    );
    draft.response.body[IF_ID] = result;
  }
};
