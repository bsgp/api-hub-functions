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

  const tableKeys = ["cost_object", "bill", "party", "attachment"]; // "ref_doc"
  const tableListRes = await Promise.all(
    tableKeys.map(async (tableKey) => {
      const tableData = fn.getDB_Object(newData, {
        key: tableKey,
        contractID,
        makeid,
      });
      if (tableData.length === 0) {
        return {
          E_STATUS: "S",
          E_MESSAGE: `no data ${tables[tableKey].name}`,
          result: tableData,
        };
      }
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
};
