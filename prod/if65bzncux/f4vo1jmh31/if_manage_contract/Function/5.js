module.exports = async (draft, { sql, tryit }) => {
  const { tables, newData } = draft.json;
  let contract = {};
  if (newData.contractID) {
    const query = sql("mysql", { useCustomRole: false })
      .select(tables.contract.name)
      .where("id", "like", Number(newData.contractID));
    const queryResult = await query.run();
    const contractID = tryit(() => queryResult.body.list[0].id, "");
    const tableList = ["party", "bill", "ref_doc", "cost_object", "attachment"];
    if (contractID) {
      contract = { ...contract, ...queryResult.body.list[0], contractID };
      await Promise.all(
        tableList.map(async (tableKey) => {
          const queryTableData = await sql("mysql", { useCustomRole: false })
            .select(tables[tableKey].name)
            .where("contract_id", "like", contractID)
            .run();
          const tableData = tryit(() => queryTableData.body.list, []);
          contract[tableKey] = tableData;
          return true;
        })
      );
    }
  }

  draft.response.body = {
    request_contractID: newData.contractID,
    contract,
    E_STATUS: "S",
    E_MESSAGE: `계약번호: ${contract.contractID}\n조회가\n완료되었습니다`,
  };
};
