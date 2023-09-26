module.exports = async (draft, { request, sql, tryit }) => {
  draft.response.body = {};
  const { tables, newData } = draft.json;
  const queryBuilder = sql("mysql", { useCustomRole: false })
    .select(tables.party.name)
    .select(`${tables.party.name}.ref_id`, `${tables.party.name}.name`)
    .orderBy("ref_id")
    .groupBy("ref_id");
  if (newData.key) {
    queryBuilder
      .where("ref_id", "like", `%${newData.key}%`)
      .orWhere("name", "like", `%${newData.key}%`);
  }
  const queryResult = await queryBuilder.run();
  const list = tryit(() => queryResult.body.list, []);
  draft.response.body = {
    ...draft.response.body,
    request,
    list,
    E_STATUS: "S",
    E_MESSAGE: "계약당사자 정보가 조회되었습니다",
  };
};
