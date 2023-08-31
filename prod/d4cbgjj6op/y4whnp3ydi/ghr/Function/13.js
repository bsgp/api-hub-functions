module.exports = async (draft) => {
  draft.pipe.json.keyColumns = ["FormInstID"];

  const { table } = draft.pipe.json;

  const { builderGhr } = draft.pipe.ref;

  const resultGw = draft.response;

  const entriesGhr = resultGw.body.list.map((each) => ({
    COMPANY: each.CompanyCode,
    EMPNO: each.EmpNo,
    ABS_TAKE: each.ABS_TAKE,
    BGN_DT: each.BGN_DT,
    END_DT: each.END_DT,
    BGN_HRS: each.BGN_HRS,
    END_HRS: each.END_HRS,
    EDU_CURR_TITLE: each.EDU_CURR_TITLE,
    EDU_CENTER: each.EDU_CENTER,
    EDU_TIME: each.EDU_TIME,
    EDU_EXP: each.EDU_EXP,
    LEGACY_CODE: each.LEGACY_CODE,
  }));

  const query = builderGhr.multi(table.ghr, { force: true });
  entriesGhr.forEach((each) => {
    query.add(function () {
      this.insert({
        ...each,
        BGN_DT: builderGhr.knex.raw(":BGN_DT"),
        END_DT: builderGhr.knex.raw(":END_DT"),
      });
      query.bindings.push({
        BGN_DT: { dir: "BIND_IN", type: "DATE", val: each.BGN_DT },
        END_DT: { dir: "BIND_IN", type: "DATE", val: each.END_DT },
      });
    });
  });
  const resultGhr = await query.run();

  draft.response = resultGhr;
  draft.pipe.ref.resultGw = resultGw;
};
