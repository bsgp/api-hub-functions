module.exports = async (draft, { sql }) => {
  const { tables, newData } = draft.json;
  const query = sql("mysql", { useCustomRole: false })
    .select(tables.contract.name)
    .where("id", "like", Number(newData.contractID));
  const queryResult = await query.run();

  draft.response.body = {
    request_contractID: newData.contractID,
    tables,
    queryResult,
    contract: {
      contractID: "7546",
      type: "P",
      partyList: [],
      costObjectList: [],
      billList: [],
      attachmentList: [],
    },
    E_STATUS: "S",
    E_MESSAGE: "TEST",
  };
};
