module.exports = async (draft, { sql }) => {
  const mysql = sql("mysql");
  const { update, where } = draft.json.updateQuery;

  draft.response.body = await mysql
    .update(update, { DELETED: true })
    .where(where)
    .run();
};
