module.exports = async (draft) => {
  const { builderGw } = draft.pipe.ref;
  const { table } = draft.pipe.json;

  const resultGhr = draft.response;

  const entriesGw = resultGhr.body.list.map((each) => ({
    GroupCode: each.JOB_TITLE,
    CompanyCode: each.COMPANY,
    DisplayName: each.JOB_TITLE_NM,
    MultiDisplayName: each.JOB_TITLE_NM_LANG,
    SortKey: each.SORT_ORDER,
    IsUse: each.EFF_STATUS,
    IsDisplay: each.ORG_PRINT_FLAG,
    IsMail: each.EMAIL_USE_YN,
    PrimaryMail: each.EMAIL,
  }));

  const resGw = [];

  const queryGw = builderGw.multi(table.gw, { force: true });
  entriesGw.forEach((each) => {
    resGw.push({
      GroupCode: each.GroupCode,
      CompanyCode: each.CompanyCode,
    });
    queryGw.add(function () {
      this.insert(each);
    });
  });
  const resultGw = await queryGw.run();

  draft.response = resultGw;
  draft.pipe.ref.resultGhr = resultGhr;
  draft.pipe.ref.resGw = resGw;

  // if (resultGw.statusCode === 200) {
  //   const queryGhr2 = builderGhr.multi(table.ghr);
  //   resultGw.body.list.forEach((each) => {
  //     const eachGw = resGw[each.index];

  //     let TRANSFER_STATUS = "S";
  //     let TRANSFER_MESSAGE = "성공";
  //     const TRANSFER_HRS = currentTimeString;

  //     if (each.code === "F") {
  //       TRANSFER_STATUS = "E";
  //       TRANSFER_MESSAGE = each.result.errorMessage || "실패";
  //     }

  //     eachGw.TRANSFER_STATUS = TRANSFER_STATUS;
  //     eachGw.TRANSFER_MESSAGE = TRANSFER_MESSAGE;
  //     eachGw.TRANSFER_HRS = TRANSFER_HRS;

  //     const eachGhr = resultGhr.body.list[each.index];
  //     queryGhr2.add(function () {
  //       this.update({
  //         TRANSFER_STATUS,
  //         TRANSFER_MESSAGE,
  //         TRANSFER_HRS,
  //       }).where("IF_GW_SEQ", eachGhr.IF_GW_SEQ);
  //     });
  //   });
  //   await queryGhr2.run();

  //   draft.response.body = {
  //     count: resGw.length,
  //     list: resGw,
  //     E_STATUS: "S",
  //     E_MESSAGE: `${resGw.length}건을 처리하였습니다`,
  //   };
  // }
};
