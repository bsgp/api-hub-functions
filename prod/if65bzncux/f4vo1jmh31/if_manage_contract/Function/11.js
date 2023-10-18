module.exports = async (
  draft,
  {
    request,
    // sql, env
  }
) => {
  const { tables, newData } = draft.json;
  // await sql("mysql", {
  //   useCustomRole: false,
  //   stage: env.CURRENT_ALIAS,
  // })
  //   .update(tables[tableKey].name, { deleted: true })
  //   .where("contract_id", "like", contractID)
  //   .where("id", "like", before.id)
  //   .run();
  draft.response.body = {
    request,
    tables,
    newData,
    E_STATUS: "F",
    E_MESSAGE: `TEST`,
  };
};
