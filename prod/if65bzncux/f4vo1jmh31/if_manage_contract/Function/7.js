module.exports = async (draft, { sql, tryit, fn }) => {
  const { tables, newData } = draft.json;
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
        queryBuilder.orderBy("index", "asc");
      }

      const queryTableData = await queryBuilder.run();
      const tableData = tryit(() => queryTableData.body.list, []);
      if (tableKey === "contract") {
        origin[tableKey] = tableData[0];
      } else origin[tableKey] = tableData;

      return true;
    })
  );

  const { contract, party, bill, cost_object, attachment } = origin; //ref_doc

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
            before: item,
            after: "deleted",
          })
        );
      //find created || changed
      fChanged.forEach((item) => {
        const beforeObj = fOrigin.find((it) => it.id === item.id);
        if (!beforeObj) {
          changeList.push({
            index: item.index,
            before: "created",
            after: { ...item },
          });
        } else {
          Object.keys(item).forEach((field) => {
            if (item[field] !== beforeObj[field]) {
              changeList.push({
                key: field,
                index: item.index,
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

  draft.response.body = {
    request_contractID: contractID,
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
    E_STATUS: "S",
    E_MESSAGE: `계약번호: ${origin.contractID}\n조회가\n완료되었습니다`,
  };
};
