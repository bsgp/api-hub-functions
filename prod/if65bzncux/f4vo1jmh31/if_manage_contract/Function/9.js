module.exports = async (draft, { sql, env, tryit, fn, dayjs }) => {
  const { tables, newData } = draft.json;
  const { contractID } = newData;

  const changedData = await sql("mysql", {
    useCustomRole: false,
    stage: env.CURRENT_ALIAS,
  })
    .select(tables["change"].name)
    .where("row_key", "like", `${contractID}`)
    .orWhere("row_key", "like", `${contractID}%`)
    .orderBy("changed_at")
    .run();

  const chagedList = tryit(() => changedData.body.list, []);

  draft.response.body = {
    E_MESSAGE: "변경내역 조회가 완료되었습니다",
    E_STATUS: "S",
    contractID,
    chagedList,
    history: {
      contract: chagedList
        .filter((list) => list.type === "contract")
        .map(({ changed_at, changed_by, content }) => ({
          changed_at: fn.convDate(dayjs, changed_at),
          changed_by,
          content: JSON.stringify(content),
        })),
      partyList: chagedList
        .filter((list) => list.type === "party")
        .map(({ changed_at, changed_by, content }) => ({
          changed_at: fn.convDate(dayjs, changed_at),
          changed_by,
          content: JSON.stringify(content),
        })),
      costObjectList: chagedList
        .filter((list) => list.type === "cost_object")
        .map(({ changed_at, changed_by, content }) => ({
          changed_at: fn.convDate(dayjs, changed_at),
          changed_by,
          content: JSON.stringify(content),
        })),
      wbsList: chagedList
        .filter((list) => list.type === "wbs")
        .map(({ changed_at, changed_by, content }) => ({
          changed_at: fn.convDate(dayjs, changed_at),
          changed_by,
          content: JSON.stringify(content),
        })),
      billList: chagedList
        .filter((list) => list.type === "bill")
        .map(({ changed_at, changed_by, content }) => ({
          changed_at: fn.convDate(dayjs, changed_at),
          changed_by,
          content: JSON.stringify(content),
        })),
      attachmentList: chagedList
        .filter((list) => list.type === "attachment")
        .map(({ changed_at, changed_by, content }) => ({
          changed_at: fn.convDate(dayjs, changed_at),
          changed_by,
          content: JSON.stringify(content),
        })),
    },
  };
};
