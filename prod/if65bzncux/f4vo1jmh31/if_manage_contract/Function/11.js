module.exports = async (
  draft,
  {
    request,
    // sql, env
  }
) => {
  // your script
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
    E_STATUS: "F",
    E_MESSAGE: `TEST`,
  };
};
