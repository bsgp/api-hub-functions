module.exports = async (draft, { sql, tryit }) => {
  const { tables, newData } = draft.json;
  const { contractID } = newData;

  const changedData = await sql("mysql", { useCustomRole: false })
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
      contract: chagedList.filter((list) => list.type === "contract"),
      partyList: [],
      costObjectList: [],
      billList: [],
      attachmentList: [],
    },
  };
};
