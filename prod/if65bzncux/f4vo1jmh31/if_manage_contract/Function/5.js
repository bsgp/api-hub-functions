module.exports = async (draft, { sql, env, tryit, fn, user }) => {
  const { interfaceID, tables, newData } = draft.json;
  const sqlParams = { useCustomRole: false, stage: env.CURRENT_ALIAS };

  switch (interfaceID) {
    case "IF-CT-101": {
      if (!newData.contractID) {
        draft.response.body = { E_STATUS: "F", E_MESSAGE: "Wrong Request" };
        return;
      }
      const query = sql("mysql", sqlParams)
        .select(tables.contract.name)
        .where("id", "like", newData.contractID);
      const queryResult = await query.run();

      const contractID = tryit(() => queryResult.body.list[0].id, "");
      if (!contractID) {
        const E_MESSAGE = "해당하는 계약정보가\n없습니다";
        draft.response.body = { E_STATUS: "F", E_MESSAGE };
        return;
      }
      const results = { contract: queryResult.body.list[0] };

      const tableList = ["party", "bill", "cost_object", "wbs", "attachment"];

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

      if (
        results.contract.bukrs !== "" &&
        user.bukrs !== "*" &&
        results.contract.bukrs !== user.bukrs
      ) {
        const E_MESSAGE = "해당 계약정보에 권한이\n없습니다";
        draft.response.body = { E_STATUS: "F", E_MESSAGE };
        return;
      } else {
        draft.response.body = {
          request_contractID: newData.contractID,
          contract: {
            ...results.contract,
            contractID,
            partyList: results.party,
            costObjectList:
              results.contract.type === "P"
                ? results.cost_object
                : results.cost_object.map((item) => {
                    const fBills = (results.actual_billing || []).filter(
                      ({ id, parent_id, fi_number }) =>
                        (id === item.id || parent_id === item.id) && fi_number
                    );
                    const sum_dmbtr = fBills.reduce((acc, curr) => {
                      return acc + Number(curr.dmbtr_supply);
                    }, 0);
                    const totalBillAmt = Math.round(sum_dmbtr * 100) / 100;

                    let bill_status, bill_status_text;
                    if (totalBillAmt === 0) {
                      bill_status = "1";
                      bill_status_text = "미완료";
                    } else if (totalBillAmt !== Number(item.dmbtr_supply)) {
                      bill_status = "2";
                      bill_status_text = "부분완료";
                    } else {
                      bill_status = "3";
                      bill_status_text = "완료";
                    }
                    return { ...item, bill_status, bill_status_text };
                  }),
            wbsList: results.wbs,
            billList: results.bill,
            attachmentList: results.attachment,
            approvalList: results.letter_appr || [],
            actualBillingList: results.actual_billing || [],
          },
          E_STATUS: "S",
          E_MESSAGE: `계약번호: ${contractID}\n조회가\n완료되었습니다`,
        };
      }

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
        id:
          contract.costObjectList[0].bill_from_id ||
          (billFromParty && billFromParty.ref_id),
        text:
          contract.costObjectList[0].bill_from_text ||
          (billFromParty && billFromParty.name),
      };
      contract.billTo = {
        id: billToParty && billToParty.ref_id,
        text: billToParty && billToParty.name,
      };

      if (user.bukrs !== "*" && contract.bukrs !== user.bukrs) {
        draft.response.body = {
          request_contractID: newData.contractID,
          contract,
          E_STATUS: "F",
          E_MESSAGE: "해당 청구내역에 권한이\n없습니다",
        };
      } else {
        draft.response.body = {
          request_contractID: newData.contractID,
          contract,
          E_STATUS: "S",
          E_MESSAGE: "조회가\nn완료되었습니다",
        };
      }
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
