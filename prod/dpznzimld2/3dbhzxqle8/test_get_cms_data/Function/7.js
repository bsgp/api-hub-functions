module.exports = async (draft, { sql }) => {
  const mysql = sql("mysql");
  const { update, set, where } = draft.json.updateQuery;

  draft.response.body = await mysql.update(update, set).where(where).run();
};
