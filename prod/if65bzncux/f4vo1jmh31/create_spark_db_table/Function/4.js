module.exports = async (draft, { fn, sql }) => {
  /**
   * db 업데이트 시
   * function#3 table name의 number++ && functions schema update
   */
  const mysql = sql("mysql", { useCustomRole: false });
  const changed = draft.json.changed;

  await Promise.all(
    Object.keys(changed).map(async (tableKey) => {
      const spec = changed[tableKey];
      const result = await mysql.table.create(spec.name, fn[tableKey]).run();
      draft.response.body[spec.name] =
        result.statusCode === 200 ? "Succeed" : result.body;
    })
  );
};
