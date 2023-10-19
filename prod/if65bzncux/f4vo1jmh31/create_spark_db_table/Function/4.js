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
                .string("f_payment_return_deposit ", 20)
                .defaultTo("")
                .comment("선급금보증");
              table
                .string("warr_haja_deposit ", 20)
                .defaultTo("")
                .comment("하자이행보증");
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
