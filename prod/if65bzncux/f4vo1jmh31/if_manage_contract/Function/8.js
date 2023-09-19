module.exports = async (draft, { sql, tryit, fn, dayjs }) => {
  const { tables, newData } = draft.json;
  const queryBuilder = sql("mysql", { useCustomRole: false }).select(
    tables.contract.name
  );

  if (newData.contractDate[0] && newData.contractDate[1]) {
    const from = fn.convDate(dayjs, newData.contractDate[0], "YYYYMMDD", 9);
    const to = fn.convDate(dayjs, newData.contractDate[1], "YYYYMMDD", 9);
    queryBuilder.whereBetween("prod_date", [from, to]);
  }
  if (newData.contractID) {
    queryBuilder.where("id", "like", Number(newData.contractID));
  }
  if (newData.contractName) {
    queryBuilder.where("name", "like", `%${newData.contractName}%`);
  }

  const queryResult = await queryBuilder.run();
  const results = tryit(() => queryResult.body.list, []);

  draft.response.body = {
    request: newData,
    test: fn.convDate(dayjs, newData.contractDate[0], "YYYYMMDD", 9),
    list: results,
    E_STATUS: "S",
    E_MESSAGE: `조회가\n완료되었습니다`,
  };
};
