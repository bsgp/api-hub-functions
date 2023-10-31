module.exports = async (draft, { sql, env, tryit }) => {
  const { interfaceID, tables, newData } = draft.json;
  switch (interfaceID) {
    case "IF-CT-101": {
      let results = {};
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
          results = { contract: queryResult.body.list[0], contractID };
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
        }
      }
      const { contract, party, bill, cost_object, wbs, attachment } = results;
      //ref_doc

      draft.response.body = {
        request_contractID: newData.contractID,
        contract: {
          ...contract,
          contractID: results.contractID,
          partyList: party.sort(
            (al, be) => Number(al.index) - Number(be.index)
          ),
          costObjectList: cost_object.sort(
            (al, be) => Number(al.index) - Number(be.index)
          ),
          wbsList: wbs.sort((al, be) => Number(al.index) - Number(be.index)),
          billList: bill.sort((al, be) => Number(al.index) - Number(be.index)),
          attachmentList: attachment.sort(
            (al, be) => Number(al.index) - Number(be.index)
          ),
        },
        E_STATUS: results.contractID ? "S" : "F",
        E_MESSAGE: results.contractID
          ? `계약번호: ${results.contractID}\n조회가\n완료되었습니다`
          : "해당하는\n계약정보가\n없습니다",
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
