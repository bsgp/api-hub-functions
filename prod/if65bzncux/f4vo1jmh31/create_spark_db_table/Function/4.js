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
        if (spec.desc === "Party(supplier, customer) info DB") {
          const alterResult = await mysql.table
            .alter(spec.name, function (table) {
              table.string("gl_group_id", 20).defaultTo("").comment("계정그룹");
              table
                .string("gl_group_text", 20)
                .defaultTo("")
                .comment("계정그룹텍스트");
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
