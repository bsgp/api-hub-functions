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
          if (results.contract.gpro_document_no) {
            const queryTableData = await sql("mysql", sqlParams)
              .select(tables["letter_appr"].name)
              .where("contract_id", "like", contractID)
              .run();
            const tableData = tryit(() => queryTableData.body.list, []);
            results["letter_appr"] = tableData;
          }
          if (results.contract.type === "S") {
            const queryTableData = await sql("mysql", sqlParams)
              .select(tables["actual_billing"].name)
              .where("contract_id", "like", contractID)
              .whereNot({ deleted: true })
              .orderBy("index", "asc")
              .run();
            const tableData = tryit(() => queryTableData.body.list, []);
            results["actual_billing"] = fn.sortIndexFn(tableData);
          }

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
              approvalList: results.letter_appr || [],
              actualBillingList: results.actual_billing || [],
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
      const itemID = newData.itemID;
      const contract = { ...queryResult.body.list[0], contractID, itemID };

      const costObjectQueryData = await sql("mysql", sqlParams)
        .select(tables.cost_object.name)
        .where("contract_id", "like", contractID)
        .where("id", "like", itemID)
        .whereNot({ deleted: true })
        .run();
      const costObjectData = tryit(() => costObjectQueryData.body.list, []);
      if (costObjectData.length === 0) {
        draft.response.body = {
          request_contractID: newData.contractID,
          request_itemID: itemID,
          E_STATUS: "F",
          E_MESSAGE: "해당하는\n청구항목정보가\n없습니다",
        };
        return;
      }
      contract.costObjectList = costObjectData;

      const actualBillingQueryData = await sql("mysql", sqlParams)
        .select(tables.actual_billing.name)
        .where("contract_id", "like", contractID)
        .where(function () {
          this.where("id", "like", itemID).orWhere("parent_id", "like", itemID);
        })
        .whereNot({ deleted: true })
        .run();
      const actualBillng = tryit(() => actualBillingQueryData.body.list, []);
      contract.actualBillng = fn.sortIndexFn(actualBillng);

      const partyQueryData = await sql("mysql", sqlParams)
        .select(tables.party.name)
        .where("contract_id", "like", contractID)
        .whereNot({ deleted: true })
        .orderBy("index", "asc")
        .run();
      const party = tryit(() => partyQueryData.body.list, []);
      const partyList = fn.sortIndexFn(party);
      const billFromParty = partyList.find((party) => party.stems10 === "1");
      const billToParty = partyList.find((party) => party.stems10 === "2");
      contract.partyList = partyList;
      contract.billFrom = {
        id: billFromParty && billFromParty.ref_id,
        text: billFromParty && billFromParty.name,
      };
      contract.billTo = {
        id: billToParty && billToParty.ref_id,
        text: billToParty && billToParty.name,
      };

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
