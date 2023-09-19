module.exports = async (draft, { sql, tryit }) => {
  const { tables, newData } = draft.json;
  const queryBuilder = sql("mysql", { useCustomRole: false }).select(
    tables.contract.name
  );

  if (newData.contractID) {
    queryBuilder.where("id", "like", Number(newData.contractID));
  }

  const queryResult = await queryBuilder.run();
  const results = tryit(() => queryResult.body.list, []);

  draft.response.body = {
    request: newData,
    list: results,
    E_STATUS: "S",
    E_MESSAGE: `조회가\n완료되었습니다`,
  };
};
