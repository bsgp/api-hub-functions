module.exports = async (draft, { request, clone, tryit, file, env, sql }) => {
  const webhookData = clone(request.body.Data);
  const stage = env.CURRENT_ALIAS;
  const sqlParams = { useCustomRole: false, stage };
  // await file.upload("unipost/test.json", webhookData, { stage });
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
    { id: "ENC", uni_id: "10", text: "신규계약작성중", isNew: true },
    { id: "ENC", uni_id: "10", text: "변경계약작성중", isNew: false },
    { id: "RSC", uni_id: "30", text: "진행중" },
    { id: "DRN", uni_id: "50", text: "신규계약 수정요청", isNew: true },
    { id: "CDN", uni_id: "50", text: "변경계약 수정요청", isNew: false },
    { id: "DRN", uni_id: "51", text: "신규계약 반려", isNew: true },
    { id: "CDN", uni_id: "51", text: "변경계약 반려", isNew: false },
    { id: "SSC", uni_id: "70", text: "신규계약 완료" },
  ];

  const contInfo = tryit(() => webhookData.contInfo, {}) || {};
  const contSts = tryit(() => contInfo.contSts, "");
  const contractID = tryit(() => contInfo.apiUserKey, "");
  const isNew = tryit(() => Number(contInfo.contSeq), "") === 0;
  const fStatus = statusList.find(
    (item) =>
      item.uni_id === contSts &&
      (item.isNew === undefined || item.isNew === isNew)
  );
  if (!fStatus) {
    draft.response.body = {
      webhookData,
      E_STATUS: "F",
      E_MESSAGE: "Cannot find status at statusList",
    };
    return;
  }
  if (!contractID) {
    draft.response.body = {
      webhookData,
      fStatus,
      E_STATUS: "F",
      E_MESSAGE: "Cannot find apiUserKey(contractID) at webhookData",
    };
    return;
  }
  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
    stage,
  });

  const updateResult = await sql("mysql", sqlParams)
    .update(tables.contract.name, {
      status: fStatus.id,
      seq: contInfo.contSeq,
      uni_contno: contInfo.contNo, // 계약관리번호
      uni_contseq: contInfo.contSeq, //  계약관리 일련번호
      uni_coregno: contInfo.coRegno, // 계약소유자 사업자등록번호
      uni_contname: contInfo.contName, // 계약명
      uni_contdate: contInfo.contDate, // 계약일자(yyyyMMdd)
      uni_contsts: contInfo.contSts, // 계약상태코드
      uni_contstsname: contInfo.contStsName, // 계약상태명
    })
    .where({ id: contractID })
    .run();

  draft.response.body = {
    webhookData,
    fStatus,
    updateResult,
    E_STATUS: updateResult.statusCode === "200" ? "S" : "F",
  };
};
