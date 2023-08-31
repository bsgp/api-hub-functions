module.exports = async (draft, { request, sql }) => {
  const { target, tables } = draft.pipe.json;

  const metaItems = await sql("mysql")
    .select(getTableByIndicator("mitem"))
    .where({ MD_ID: target })
    .andWhere(getNotDeleted)
    .run();

  const metaTypes = await sql("mysql")
    .select(getTableByIndicator("mtype"))
    .andWhere(getNotDeleted)
    .run();

  draft.response.statusCode = 200;
  draft.response.body = {
    mitem: metaItems.body,
    mtype: metaTypes.body
  };

  /* tools */
  function getTableByIndicator(tableIndicator) {
    return tables[tableIndicator].name;
  }

  function getNotDeleted(builder) {
    return builder.whereNull("DELETED").orWhere({ DELETED: false });
  }
};
