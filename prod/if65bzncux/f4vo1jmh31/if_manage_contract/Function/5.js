module.exports = async (draft, { sql, env, tryit, fn }) => {
  const { interfaceID, tables, newData } = draft.json;
  const sqlParams = { useCustomRole: false, stage: env.CURRENT_ALIAS };

  switch (interfaceID) {
    case "IF-CT-101": {
      const tableList = ["party", "bill", "cost_object", "wbs", "attachment"];
      if (newData.contractID) {
        const query = sql("mysql", sqlParams)
          .select(tables.contract.name)
          .where("id", "like", newData.contractID);
        const queryResult = await query.run();

        const contractID = tryit(() => queryResult.body.list[0].id, "");
        if (contractID) {
          const results = { contract: queryResult.body.list[0] };
          await Promise.all(
            tableList.map(async (tableKey) => {
              const queryTableData = await sql("mysql", sqlParams)
                .select(tables[tableKey].name)
                .where("contract_id", "like", contractID)
                .whereNot({ deleted: true })
                .orderBy("index", "asc")
                .run();
              const tableData = tryit(() => queryTableData.body.list, []);
              results[tableKey] = fn.sortIndexFn(tableData);
              return true;
            })
          );

          draft.response.body = {
            request_contractID: newData.contractID,
            contract: {
              ...results.contract,
              contractID,
              partyList: results.party,
              costObjectList: results.cost_object,
              wbsList: results.wbs,
              billList: results.bill,
              attachmentList: results.attachment,
            },
            E_STATUS: contractID ? "S" : "F",
            E_MESSAGE: contractID
              ? `계약번호: ${contractID}\n조회가\n완료되었습니다`
              : "해당하는\n계약정보가\n없습니다",
          };
        } else {
          draft.response.body = {
            request_contractID: newData.contractID,
            E_STATUS: "F",
            E_MESSAGE: "해당하는\n계약정보가\n없습니다",
          };
        }
      } else
        draft.response.body = { E_STATUS: "F", E_MESSAGE: "Wrong Request" };
      break;
    }
    case "IF-CT-111": {
      if (!newData.contractID || !newData.itemID) {
        draft.response.body = { E_STATUS: "F", E_MESSAGE: "Wrong Request" };
        return;
      }
      const query = sql("mysql", sqlParams)
        .select(tables.contract.name)
        .where("id", "like", newData.contractID);
      const queryResult = await query.run();
      const contractID = tryit(() => queryResult.body.list[0].id, "");
      if (!contractID) {
        draft.response.body = {
          request_contractID: newData.contractID,
          E_STATUS: "F",
          E_MESSAGE: "해당하는\n계약정보가\n없습니다",
        };
        return;
      }
      const contract = { ...queryResult.body.list[0], contractID };
      // const tableList = ["party", "cost_object", "actual_billing"];

      const partyQueryData = await sql("mysql", sqlParams)
        .select(tables[party].name)
        .where("contract_id", "like", contractID)
        .whereNot({ deleted: true })
        .orderBy("index", "asc")
        .run();
      const party = tryit(() => partyQueryData.body.list, []);
      contract.partyList = fn.sortIndexFn(party);

      draft.response.body = {
        request_contractID: newData.contractID,
        contract,
        E_STATUS: "S",
        E_MESSAGE: "IF-CT-111",
      };
      break;
    }
    default: {
      draft.response.body = {
        request_contractID: newData.contractID,
        E_STATUS: "F",
        E_MESSAGE: "wrong interfaceID",
      };
      break;
    }
  }
};
