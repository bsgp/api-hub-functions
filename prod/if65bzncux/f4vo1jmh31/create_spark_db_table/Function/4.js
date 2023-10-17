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
              table.string("prdnt_name", 30).defaultTo("").comment("대표자 명");
              table.string("id_no", 20).defaultTo("").comment("사업자등록번호");
              table.string("biz_no", 20).defaultTo("").comment("법인등록번호");
              table.string("land_id", 2).defaultTo("").comment("국가키");
              table.string("address", 100).defaultTo("").comment("주소");
              table.string("tel", 20).defaultTo("").comment("연락처");
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
