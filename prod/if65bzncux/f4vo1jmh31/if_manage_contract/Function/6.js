module.exports = async (draft, { fn, sql, tryit, makeid }) => {
  const { tables, newData } = draft.json;
  const contract = fn.getDB_Object(newData, { key: "contract" });

  // const builder = sql("mysql").select(tables.contract.name);
  // const contractValidator = await builder.validator;

  const createContract = await sql("mysql", { useCustomRole: false })
    .insert(tables.contract.name, contract)
    .run();

  if (createContract.statusCode !== 200) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed save ${tables.contract.name}`,
      createContract,
    };
    draft.response.statusCode = 400;
    return;
  }

  const query = sql("mysql", { useCustomRole: false })
    .select(tables.contract.name)
    .orderBy("id", "desc")
    .limit(1);
  const queryResult = await query.run();

  const contractID = tryit(() => queryResult.body.list[0].id, "");
  if (!contractID) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed get contractID`,
      createContract,
    };
    draft.response.statusCode = 400;
    return;
  }

  const tableListRes = await Promise.all(
    [
      "cost_object",
      "bill",
      "party",
      "attachment",
      // "ref_doc",
    ].map(async (tableKey) => {
      const tableData = fn.getDB_Object(newData, {
        key: tableKey,
        contractID,
        makeid,
      });
      const postTableData = await sql("mysql", { useCustomRole: false })
        .insert(tables[tableKey].name, tableData)
        .run();
      if (postTableData.statusCode !== 200) {
        return {
          E_STATUS: "F",
          E_MESSAGE: `Failed save ${tables[tableKey].name}`,
          result: postTableData,
        };
      } else
        return {
          E_STATUS: "S",
          E_MESSAGE: `saved ${tables[tableKey].name}`,
          result: postTableData,
        };
    })
  );

  if (tableListRes.find((res) => res.E_STATUS === "F")) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `계약 내용을 저장하는 과정에서 문제가 발생했습니다`,
      contractID,
      tableListRes,
    };
  } else {
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: `계약번호: ${contractID}\n생성되었습니다`,
      contractID,
      tableListRes,
    };
  }

  // const partyArr = fn.getDB_Object(newData, {
  //   key: "party",
  //   contractID,
  //   makeid,
  // });
  // const createParty = await sql("mysql", { useCustomRole: false })
  //   .insert(tables.party.name, partyArr)
  //   .run();
  // if (createParty.statusCode !== 200) {
  //   draft.response.body = {
  //     E_STATUS: "F",
  //     E_MESSAGE: `Failed save ${tables.party.name}`,
  //     createParty,
  //   };
  //   draft.response.statusCode = 400;
  //   return;
  // }

  // draft.response.body = {
  //   E_STATUS: "S",
  //   E_MESSAGE: `계약번호: ${contractID}\n생성되었습니다`,
  //   contractID,
  //   contract: {
  //     ...queryResult.body.list[0],
  //     contractID,
  //     partyList: [],
  //     costObjectList: [],
  //     billList: [],
  //     attachmentList: [],
  //   },
  // };

  // const ref_doc = [];
  // const cost_object = [];
  // const bill = [];
  // const party = [];

  // draft.response.body = {
  //   E_STATUS: "S",
  //   E_MESSAGE: "TEST",
  //   ...draft.response.body,
  //   request_contractID: draft.json.newData.contractID,
  //   tables: draft.json.tables,
  //   contract: {
  //     type: "P",
  //     contractID: "7775577",
  //     partyList: [],
  //     costObjectList: [],
  //     billList: [],
  //     attachmentList: [],
  //   },
  // };
};
