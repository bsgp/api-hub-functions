module.exports = async (draft, { request, sql }) => {
  const { groupID, tables } = draft.pipe.json;

  const grpFiles = await sql("mysql")
    .select(getTableByIndicator("gfile"))
    .where({ GROUP_ID: groupID })
    .andWhere(getNotDeleted)
    .run()

  draft.response = grpFiles;

  /* tools */
  function getTableByIndicator(tableIndicator) {
    return tables[tableIndicator].name;
  }

  function getNotDeleted(builder) {
    return builder.whereNull("DELETED").orWhere({ DELETED: false });
  }
};
