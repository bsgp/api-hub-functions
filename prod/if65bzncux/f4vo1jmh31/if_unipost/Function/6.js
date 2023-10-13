module.exports = async (draft, { request, clone, tryit, file, env, sql }) => {
  const webhookData = clone(request.body.Data);
  // await file.upload("unipost/test.json", webhookData, {
  //   stage: env.CURRENT_ALIAS,
  // });
  const statusList = [
    { id: "ENC", uni_id: "10", text: "작성중" },
    { id: "RSC", uni_id: "30", text: "진행중" },
    { id: "DRN", uni_id: "50", text: "수정요청" },
    { id: "DRN", uni_id: "51", text: "반려" },
    { id: "SSC", uni_id: "70", text: "완료" },
  ];

  const contSts = tryit(() => webhookData.contInfo.contSts, "");
  const apiUserKey = tryit(() => webhookData.contInfo.apiUserKey, "");
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
    .update(tables.contract.name, { status: fStatus.id })
    .where({ id: apiUserKey })
    .run();

  draft.response.body = {
    webhookData,
    fStatus,
    updateResult,
    E_STATUS: updateResult.statusCode === "200" ? "S" : "F",
  };
};
