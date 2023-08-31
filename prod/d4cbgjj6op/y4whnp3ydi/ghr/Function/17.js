module.exports = async (draft) => {
  const { builderGw } = draft.pipe.ref;
  const { table } = draft.pipe.json;

  const resultGhr = draft.response;

  const entriesGw = resultGhr.body.list.map((each) => ({
    JobType: each.JOB_TYPE,
    UserCode: each.PERSON_ID,
    CompanyCode: each.COMPANY,
    DeptCode: each.DEPT,
    JobLevelCode: each.GRADE,
    JobPositionCode: each.JOB_POSITION,
    JobTitleCode: each.JOB_TITLE,
    IsUse: each.USE_YN,
    SortKey: each.SORT_ORDER,
  }));

  const resGw = [];

  const queryGw = builderGw.multi(table.gw, { force: true });
  entriesGw.forEach((each) => {
    resGw.push({
      JobType: each.JobType,
      UserCode: each.UserCode,
      CompanyCode: each.CompanyCode,
      DeptCode: each.DeptCode,
    });
    queryGw.add(function () {
      this.insert(each);
    });
  });
  const resultGw = await queryGw.run();

  draft.response = resultGw;
  draft.pipe.ref.resultGhr = resultGhr;
  draft.pipe.ref.resGw = resGw;
};
