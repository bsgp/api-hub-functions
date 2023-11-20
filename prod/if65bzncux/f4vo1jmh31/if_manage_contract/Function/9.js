module.exports = async (draft, { sql, env, tryit, fn, dayjs }) => {
  const { interfaceID, tables, newData } = draft.json;
  const sqlParams = { useCustomRole: false, stage: env.CURRENT_ALIAS };
  const { contractID } = newData;

  switch (interfaceID) {
    case "IF-CT-108": {
      break;
    }
    case "IF-CT-109": {
      const changedData = await sql("mysql", sqlParams)
        .select(tables["change"].name)
        .where("row_key", "like", `${contractID}`)
        .orWhere("row_key", "like", `${contractID}%`)
        .orderBy("changed_at")
        .run();

      const chagedList = tryit(() => changedData.body.list, []);
      const conversionFn = (arr = [], type = "") =>
        arr
          .filter((list) => list.type === type)
          .map(({ changed_at, changed_by, content }) => ({
            changed_at: fn.convDate(dayjs, changed_at),
            changed_by,
            content: JSON.stringify(content),
          }));

      draft.response.body = {
        E_MESSAGE: "변경내역 조회가 완료되었습니다",
        E_STATUS: "S",
        contractID,
        chagedList,
        history: {
          contract: conversionFn(chagedList, "contract"),
          partyList: conversionFn(chagedList, "party"),
          costObjectList: conversionFn(chagedList, "cost_object"),
          wbsList: conversionFn(chagedList, "wbs"),
          billList: conversionFn(chagedList, "bill"),
          attachmentList: conversionFn(chagedList, "attachment"),
        },
      };
      break;
    }
    default: {
      draft.response.body = { E_MESSAGE: "Wrong Interface ID", E_STATUS: "F" };
      break;
    }
  }
};
