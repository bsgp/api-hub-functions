module.exports = async (draft, { request, clone, tryit, file, env, sql }) => {
  const webhookData = clone(request.body.Data);
  // await file.upload("unipost/test.json", webhookData, {
  //   stage: env.CURRENT_ALIAS,
  // });
  // {
  //   "secretKey":"",
  //   "contInfo":{
  //     "contDate":"20231005",
  //     "contStsName":"작성중",
  //     "contSts":"10",
  //     "contName":"test xxxx",
  //     "apiUserKey":"P202300008",
  //     "contSeq":0,
  //     "contNo":"CN462000108606",
  //     "coRegno":"2018122611"
  //   }
  // }
  const statusList = [
    { id: "DRN", uni_id: "10", text: "작성중" },
    { id: "RSC", uni_id: "30", text: "진행중" },
    { id: "DRN", uni_id: "50", text: "수정요청" },
    { id: "DRN", uni_id: "51", text: "반려" },
    { id: "SSC", uni_id: "70", text: "완료" },
  ];

  const contInfo = tryit(() => webhookData.contInfo, {}) || {};
  const contSts = tryit(() => contInfo.contSts, "");
  const apiUserKey = tryit(() => contInfo.apiUserKey, "");
  const fStatus = statusList.find((item) => item.uni_id === contSts);
  if (!fStatus) {
    draft.response.body = {
      webhookData,
      E_STATUS: "F",
      E_MESSAGE: "Cannot find status at statusList",
    };
    return;
  }
  if (!apiUserKey) {
    draft.response.body = {
      webhookData,
      fStatus,
      E_STATUS: "F",
      E_MESSAGE: "Cannot find apiUserKey at webhookData",
    };
    return;
  }
  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
    stage: env.CURRENT_ALIAS,
  });

  const updateResult = await sql("mysql", {
    useCustomRole: false,
    stage: env.CURRENT_ALIAS,
  })
    .update(tables.contract.name, {
      status: fStatus.id,
      uni_contno: contInfo.contNo, // 계약관리번호
      uni_contseq: contInfo.contSeq, //  계약관리 일련번호
      uni_coregno: contInfo.coRegno, // 계약소유자 사업자등록번호
      uni_contname: contInfo.contName, // 계약명
      uni_contdate: contInfo.contDate, // 계약일자(yyyyMMdd)
      uni_contsts: contInfo.contSts, // 계약상태코드
      uni_contstsname: contInfo.contStsName, // 계약상태명
    })
    .where({ id: apiUserKey })
    .run();

  /**
   * 서명완료 시 changed_contract: 차수, 수정내역 업데이트
   */

  draft.response.body = {
    webhookData,
    fStatus,
    updateResult,
    E_STATUS: updateResult.statusCode === "200" ? "S" : "F",
  };
};
