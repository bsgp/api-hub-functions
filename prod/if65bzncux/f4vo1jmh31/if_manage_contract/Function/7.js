module.exports = async (draft, { sql, tryit }) => {
  const { tables, newData } = draft.json;
  const contractID = newData.form.contractID;

  const query = sql("mysql", { useCustomRole: false })
    .select(tables.contract.name)
    .where("id", "like", Number(contractID));
  const queryResult = await query.run();

  const tableList = ["party", "bill", "ref_doc", "cost_object", "attachment"];
  const origin = { contract: queryResult.body.list[0], contractID };
  await Promise.all(
    tableList.map(async (tableKey) => {
      const queryTableData = await sql("mysql", { useCustomRole: false })
        .select(tables[tableKey].name)
        .where("contract_id", "like", contractID)
        .orderBy("index", "asc")
        .run();
      const tableData = tryit(() => queryTableData.body.list, []);
      origin[tableKey] = tableData;
      return true;
    })
  );

  const { contract, party, bill, cost_object, attachment } = origin; //ref_doc

  draft.response.body = {
    request_contractID: contractID,
    contract: {
      ...contract,
      contractID: origin.contractID,
      partyList: party,
      costObjectList: cost_object,
      billList: bill,
      attachmentList: attachment,
    },
    E_STATUS: "S",
    E_MESSAGE: `계약번호: ${origin.contractID}\n조회가\n완료되었습니다`,
  };
};
