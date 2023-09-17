module.exports = async (draft, { sql, tryit }) => {
  const { tables, newData } = draft.json;
  let results = {};
  if (newData.contractID) {
    const query = sql("mysql", { useCustomRole: false })
      .select(tables.contract.name)
      .where("id", "like", Number(newData.contractID));
    const queryResult = await query.run();
    const contractID = tryit(() => queryResult.body.list[0].id, "");
    const tableList = ["party", "bill", "ref_doc", "cost_object", "attachment"];
    if (contractID) {
      results = { contract: queryResult.body.list[0], contractID };
      await Promise.all(
        tableList.map(async (tableKey) => {
          const queryTableData = await sql("mysql", { useCustomRole: false })
            .select(tables[tableKey].name)
            .where("contract_id", "like", contractID)
            .run();
          const tableData = tryit(() => queryTableData.body.list, []);
          results[tableKey] = tableData;
          return true;
        })
      );
    }
  }
  const { contract, party, bill, cost_object, attachment } = results; //ref_doc

  draft.response.body = {
    request_contractID: newData.contractID,
    contract: {
      ...contract,
      contractID: results.contractID,
      partyList: party.sort((obj1, obj2) => obj1.index - obj2.index),
      costObjectList: cost_object.sort((obj1, obj2) => obj1.index - obj2.index),
      billList: bill.sort((obj1, obj2) => obj1.index - obj2.index),
      attachmentList: attachment,
    },
    E_STATUS: "S",
    E_MESSAGE: `계약번호: ${results.contractID}\n조회가\n완료되었습니다`,
  };
};
