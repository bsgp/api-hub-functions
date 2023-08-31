module.exports = async (draft, { request, sql }) => {
  const { tables, targets } = draft.pipe.json;

  const targetIDs = targets.split(",");
  const jobHeaders = await sql("mysql")
    .select(getTableByIndicator("jheader"))
    .whereIn("JOB_ID", targetIDs)
    .andWhere(getNotDeleted)
    .run();

  draft.response.statusCode = 200;
  draft.response.body = {
    jheader: jobHeaders.body
  };

  /* tools */
  function getTableByIndicator(tableIndicator) {
    return tables[tableIndicator].name;
  }

  function getNotDeleted(builder) {
    return builder.whereNull("DELETED").orWhere({ DELETED: false });
  }
};
