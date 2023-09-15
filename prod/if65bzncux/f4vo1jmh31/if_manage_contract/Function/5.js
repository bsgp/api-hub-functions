module.exports = async (draft, { sql, tryit }) => {
  const { tables, newData } = draft.json;
  let contract = {};
  if (newData.contractID) {
    const query = sql("mysql", { useCustomRole: false })
      .select(tables.contract.name)
      .where("id", "like", Number(newData.contractID));
    const queryResult = await query.run();
    const contractID = tryit(() => queryResult.body.list[0].id, "");
    if (contractID) {
      contract = { ...contract, ...queryResult.body.list[0] };
    }
  }

  draft.response.body = {
    request_contractID: newData.contractID,
    contract: {
      partyList: [],
      costObjectList: [],
      billList: [],
      attachmentList: [],
      ...contract,
    },
    E_STATUS: "S",
    E_MESSAGE: "TEST",
  };
};
