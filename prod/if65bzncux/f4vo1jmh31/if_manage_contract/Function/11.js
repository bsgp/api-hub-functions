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
    tables,
    newData,
    E_STATUS: "F",
    E_MESSAGE: `TEST`,
  };
};
