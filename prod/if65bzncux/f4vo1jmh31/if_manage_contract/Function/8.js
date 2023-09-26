module.exports = async (draft, { sql, tryit, fn, dayjs }) => {
  const { tables, newData } = draft.json;
  const queryBuilder = sql("mysql", { useCustomRole: false })
    .select(tables.contract.name)
    .select(
      `${tables.contract.name}.*`,
      `${tables.party.name}.contract_id`,
      `${tables.party.name}.ref_id`,
      `${tables.party.name}.stems10`,
      `${tables.party.name}.name as party_name`,
      `${tables.party.name}.deleted as party_deleted`
    )
    .leftJoin(
      tables.party.name,
      `${tables.contract.name}.id`,
      "=",
      `${tables.party.name}.contract_id`
    )
    .whereNot("party_deleted", true);

  const queryParams = {};
  if (newData.partyID) {
    queryBuilder
      // .select(
      //   `${tables.contract.name}.*`,
      //   `${tables.party.name}.contract_id`,
      //   `${tables.party.name}.ref_id`,
      //   `${tables.party.name}.name as party_name`
      // )
      // .leftJoin(
      //   tables.party.name,
      //   `${tables.contract.name}.id`,
      //   "=",
      //   `${tables.party.name}.contract_id`
      // )
      .where("ref_id", "like", newData.partyID);
  } else {
    if (newData.contractDate[0] && newData.contractDate[1]) {
      const from = fn.convDate(dayjs, newData.contractDate[0], "YYYYMMDD");
      const to = fn.convDate(dayjs, newData.contractDate[1], "YYYYMMDD");
      queryParams.from = from;
      queryParams.to = to;
      queryBuilder.whereBetween("prod_date", [from, to]);
    }
    if (newData.contractType) {
      queryParams.type = newData.contractType;
      queryBuilder.where("type", "like", newData.contractType);
    }
    if (newData.contractStatus) {
      queryParams.contractStatus = newData.contractStatus;
      queryBuilder.where("status", "like", newData.contractStatus);
    }
    if (newData.contractID) {
      queryParams.contractID = newData.contractID;
      queryBuilder.where("id", "like", Number(newData.contractID));
    }
    if (newData.contractName) {
      queryParams.contractName = newData.contractName;
      queryBuilder.where("name", "like", `%${newData.contractName}%`);
    }
  }

  const queryResult = await queryBuilder.run();
  const results = tryit(() => queryResult.body.list, []);

  draft.response.body = {
    request: newData,
    queryParams,
    // queryResult,
    test: fn.convDate(dayjs, newData.contractDate[0], "YYYYMMDD", 9),
    list: results,
    E_STATUS: "S",
    E_MESSAGE: `조회가\n완료되었습니다`,
  };
};
