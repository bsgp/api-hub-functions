module.exports = async (draft, { request, sql }) => {
  const { tables } = draft.pipe.json;

  const metaHeaders = await sql("mysql")
    .select(getTableByIndicator("mheader"))
    .andWhere(getNotDeleted)
    .run();

  const metaRels = await sql("mysql")
    .select(getTableByIndicator("mrelation"))
    .andWhere(getNotDeleted)
    .run();

  draft.response.statusCode = 200;
  draft.response.body = {
    mheader: metaHeaders.body,
    mrelation: metaRels.body
  };

  /* tools */
  function getTableByIndicator(tableIndicator) {
    return tables[tableIndicator].name;
  }

  function getNotDeleted(builder) {
    return builder.whereNull("DELETED").orWhere({ DELETED: false });
  }
};
