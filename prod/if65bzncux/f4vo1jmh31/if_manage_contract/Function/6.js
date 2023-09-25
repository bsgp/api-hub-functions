module.exports = async (draft, { fn, sql, tryit, makeid, file }) => {
  const { tables, newData, userID } = draft.json;
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
  } else {
    const cContract = await sql("mysql", { useCustomRole: false })
      .insert(
        tables["change"].name,
        fn.getChange_Object({
          tableKey: "contract",
          data: { ...contract, id: contractID },
          userID,
          makeid,
        })
      )
      .run();
    draft.response.body = {
      cContract,
    };
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
      if (tableKey === "attachment") {
        await Promise.all(
          newData.attachmentList.map(async (fileData) => {
            const { tempFilePath, type, name } = fileData;
            const path = [`${contractID}`, name].join("/");
            const data = await file.get(tempFilePath, {
              exactPath: true,
              returnBuffer: true,
            });
            const fileResponse = await file.upload(path, data, {
              contentType: type,
            });
            return fileResponse;
          })
        );
      }
      const changeTableData = await sql("mysql", { useCustomRole: false })
        .insert(
          tables["change"].name,
          tableData.map((data) =>
            fn.getChange_Object({ tableKey, data, userID, makeid })
          )
        )
        .run();
      const postTableData = await sql("mysql", { useCustomRole: false })
        .insert(tables[tableKey].name, tableData)
        .run();
      if (
        postTableData.statusCode !== 200 ||
        changeTableData.statusCode !== 200
      ) {
        return {
          E_STATUS: "F",
          E_MESSAGE: `Failed save ${tables[tableKey].name}`,
          changeTableData,
          result: postTableData,
        };
      } else
        return {
          E_STATUS: "S",
          E_MESSAGE: `saved ${tables[tableKey].name}`,
          changeTableData,
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
      ...draft.response.body,
      E_STATUS: "S",
      E_MESSAGE: `계약번호: ${contractID}\n생성되었습니다`,
      contractID,
      tableListRes,
    };
  }
};
