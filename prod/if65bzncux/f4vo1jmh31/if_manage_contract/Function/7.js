module.exports = async (draft, { sql, tryit, fn, makeid, file }) => {
  const { tables, newData, userID } = draft.json;
  const contractID = newData.form.contractID;

  const tableList = [
    "contract",
    "party",
    "bill",
    // "ref_doc",
    "cost_object",
    "attachment",
  ];
  const origin = { contractID };
  await Promise.all(
    tableList.map(async (tableKey) => {
      const searchKey = tableKey === "contract" ? "id" : "contract_id";
      const queryBuilder = sql("mysql", { useCustomRole: false })
        .select(tables[tableKey].name)
        .where(searchKey, "like", contractID);
      if (tableKey !== "contract") {
        queryBuilder.whereNot({ deleted: true }).orderBy("index", "asc");
      }

      const queryTableData = await queryBuilder.run();
      const tableData = tryit(() => queryTableData.body.list, []);
      if (tableKey === "contract") {
        origin[tableKey] = tableData[0];
      } else origin[tableKey] = tableData;

      return true;
    })
  );

  // const { contract, party, bill, cost_object, attachment } = origin;//ref_doc

  const changed = {};
  tableList.map((tableKey) => {
    const tableData = fn.getDB_Object(newData, { key: tableKey, contractID });
    changed[tableKey] = tableData;
  });

  const compared = tableList.reduce((acc, tableKey) => {
    const changeList = [];
    const fOrigin = origin[tableKey];
    const fChanged = changed[tableKey];
    if (tableKey === "contract") {
      Object.keys(fChanged).forEach((field) => {
        if (fChanged[field] !== fOrigin[field]) {
          changeList.push({
            key: field,
            before: fOrigin[field],
            after: fChanged[field],
          });
        }
      });
    } else {
      // find Deleted
      fOrigin
        .filter((item) => !fChanged.find((it) => it.id === item.id))
        .forEach((item) =>
          changeList.push({
            index: item.index,
            type: "deleted",
            before: { ...item },
            after: {},
          })
        );
      //find created || changed
      fChanged.forEach((item) => {
        const beforeObj = fOrigin.find((it) => it.id === item.id);
        if (!beforeObj) {
          changeList.push({
            index: item.index,
            type: "created",
            before: {},
            after: { ...item },
          });
        } else {
          Object.keys(item).forEach((field) => {
            if (item[field] !== beforeObj[field]) {
              changeList.push({
                key: field,
                index: item.index,
                type: "changed",
                before: { ...beforeObj },
                after: { ...item },
              });
            }
          });
        }
      });
    }
    acc[tableKey] = changeList;
    return acc;
  }, {});

  const updateList = Object.keys(compared).reduce((acc, tableKey) => {
    if (compared[tableKey].length > 0) {
      acc = acc.concat(
        compared[tableKey].map((item) => ({ ...item, tableKey }))
      );
    }
    return acc;
  }, []);

  const updateResult = await Promise.all(
    updateList.map(async (item) => {
      const { tableKey, type, key, before, after } = item;
      switch (type) {
        case "created": {
          // insert
          if (tableKey === "attachment") {
            const fileData = newData.attachmentList.find(
              (item) => `${item.index}` === after.index
            );
            const { tempFilePath, fileType, name } = fileData;
            const path = [`${contractID}`, name].join("/");
            const data = await file.get(tempFilePath, {
              exactPath: true,
              returnBuffer: true,
            });
            await file.upload(path, data, {
              contentType: fileType,
            });
          }
          const uuid = makeid(5);
          await sql("mysql", { useCustomRole: false })
            .insert(
              tables["change"].name,

              [
                fn.getChange_Object({
                  tableKey,
                  data: { ...after, id: uuid },
                  userID,
                  makeid,
                }),
              ]
            )
            .run();
          return await sql("mysql", { useCustomRole: false })
            .insert(tables[tableKey].name, { ...after, id: uuid })
            .run();
        }
        case "deleted": {
          // update deleted: true;
          return await sql("mysql", { useCustomRole: false })
            .update(tables[tableKey].name, { deleted: true })
            .where("contract_id", "like", contractID)
            .where("id", "like", before.id)
            .run();
        }
        default: {
          // type: "changed"; update changed
          if (tableKey === "contract") {
            const changed = {};
            changed[key] = after;
            return await sql("mysql", { useCustomRole: false })
              .update(tables[tableKey].name, changed)
              .where({ id: contractID })
              .run();
          } else {
            return await sql("mysql", { useCustomRole: false })
              .update(tables[tableKey].name, after)
              .where({ contract_id: contractID, id: before.id })
              .run();
          }
        }
      }
    })
  );

  const updateContract = { contractID };
  await Promise.all(
    tableList.map(async (tableKey) => {
      const searchKey = tableKey === "contract" ? "id" : "contract_id";
      const queryBuilder = sql("mysql", { useCustomRole: false })
        .select(tables[tableKey].name)
        .where(searchKey, "like", contractID);
      if (tableKey !== "contract") {
        queryBuilder.whereNot({ deleted: true }).orderBy("index", "asc");
      }

      const queryTableData = await queryBuilder.run();
      const tableData = tryit(() => queryTableData.body.list, []);
      if (tableKey === "contract") {
        updateContract[tableKey] = tableData[0];
      } else updateContract[tableKey] = tableData;

      return true;
    })
  );

  const { contract, party, bill, cost_object, attachment } = updateContract;
  //ref_doc

  draft.response.body = {
    contractID,
    contract: {
      ...contract,
      contractID: origin.contractID,
      partyList: party,
      costObjectList: cost_object,
      billList: bill,
      attachmentList: attachment,
    },
    compared,
    changed,
    updateResult,
    E_STATUS: "S",
    E_MESSAGE: `계약번호: ${origin.contractID}\n수정이\n완료되었습니다`,
  };
};
