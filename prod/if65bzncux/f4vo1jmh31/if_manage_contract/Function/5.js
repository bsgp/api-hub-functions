module.exports = async (draft, { sql, env, tryit, fn }) => {
  const { interfaceID, tables, newData } = draft.json;
  switch (interfaceID) {
    case "IF-CT-101": {
      if (newData.contractID) {
        const query = sql("mysql", {
          useCustomRole: false,
          stage: env.CURRENT_ALIAS,
        })
          .select(tables.contract.name)
          .where("id", "like", newData.contractID);
        const queryResult = await query.run();
        const contractID = tryit(() => queryResult.body.list[0].id, "");
        const tableList = [
          "party",
          "bill",
          "ref_doc",
          "cost_object",
          "wbs",
          "attachment",
        ];
        if (contractID) {
          const results = { contract: queryResult.body.list[0] };
          await Promise.all(
            tableList.map(async (tableKey) => {
              const queryTableData = await sql("mysql", {
                useCustomRole: false,
                stage: env.CURRENT_ALIAS,
              })
                .select(tables[tableKey].name)
                .where("contract_id", "like", contractID)
                .whereNot({ deleted: true })
                .orderBy("index", "asc")
                .run();
              const tableData = tryit(() => queryTableData.body.list, []);
              results[tableKey] = tableData;
              return true;
            })
          );
          const { party, bill, cost_object, wbs, attachment } = results;

          draft.response.body = {
            request_contractID: newData.contractID,
            contract: {
              ...results.contract,
              contractID,
              partyList: fn.sortIndexFn(party),
              costObjectList: fn.sortIndexFn(cost_object),
              wbsList: fn.sortIndexFn(wbs),
              billList: fn.sortIndexFn(bill),
              attachmentList: fn.sortIndexFn(attachment),
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
      draft.response.body = {
        request_contractID: newData.contractID,
        E_STATUS: "S",
        E_MESSAGE: "IF-CT-101",
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
