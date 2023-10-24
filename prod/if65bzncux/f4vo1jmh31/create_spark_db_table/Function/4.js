module.exports = async (draft, { fn, sql, env, makeid }) => {
  /**
   * db 업데이트 시
   * Function#3 table name의 number++ && Functions: schema update
   */
  const mysql = sql("mysql", {
    useCustomRole: false,
    stage: env.CURRENT_ALIAS,
  });
  const changed = draft.json.changed;

  await Promise.all(
    Object.keys(changed).map(async (tableKey) => {
      const spec = changed[tableKey];
      if (!fn[tableKey]) {
        draft.response.body[spec.name] = "schema not exist";
        return false;
      }
      const result = await mysql.table
        .create(spec.name, fn[tableKey]({ mysql, makeid }))
        .run();
      if (result.statusCode !== 200) {
        if (spec.desc === "Contract info DB table") {
          const alterResult = await mysql.table
            .alter(spec.name, function (table) {
              table
                .decimal("dmbtr_supply_local", 23, 2)
                .defaultTo(0)
                .comment("로컬공급가액");
              table
                .decimal("dmbtr_vat_local", 23, 2)
                .defaultTo(0)
                .comment("로컬부가세");
            })
            .run();
          draft.response.body[spec.name] = alterResult;
        }
      } else
        draft.response.body[spec.name] =
          result.statusCode === 200 ? "Succeed" : result.body;
      return true;
    })
  );
};
