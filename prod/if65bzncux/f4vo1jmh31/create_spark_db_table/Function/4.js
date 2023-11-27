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
        if (spec.desc === "groupware letter approval info DB") {
          const alterResult = await mysql.table
            .alter(spec.name, function (table) {
              // table.string("apr_status", 3).defaultTo("");
              table.string("gpro_document_no").defaultTo("");
              table.string("gpro_draft_template_no").defaultTo("");
              table.string("gpro_draft_status_code").defaultTo("");
              table.string("gpro_draft_id").defaultTo("");
              table.string("gpro_draft_templateId").defaultTo("");
              table.string("gpro_draftTemplateType").defaultTo("");
              table.string("gpro_userId").defaultTo("");
              table.string("gpro_userName").defaultTo("");
              table.string("gpro_organizationId").defaultTo("");
              table.string("gpro_organizationName").defaultTo("");
              table.json("gpro_workflows");
              // table.boolean("extra_item").defaultTo(false);
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
