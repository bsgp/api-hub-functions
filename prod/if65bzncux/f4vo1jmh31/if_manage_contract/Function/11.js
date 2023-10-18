module.exports = async (draft, { sql, env }) => {
  const { tables, newData } = draft.json;
  const updateResult = await sql("mysql", {
    useCustomRole: false,
    stage: env.CURRENT_ALIAS,
  })
    .update(tables.cost_object.name, { last_send_date: newData.last_send_date })
    .where("contract_id", "like", newData.contractID)
    .where("id", "like", newData.id)
    .run();
  draft.response.body = {
    updateResult,
    newData,
    E_STATUS: updateResult.statusCode === 200 ? "S" : "F",
    E_MESSAGE:
      updateResult.statusCode === 200
        ? "WBS 업데이트 정보를 저장했습니다"
        : "WBS 업데이트 과정에 문제가 발생했습니다",
  };
};
