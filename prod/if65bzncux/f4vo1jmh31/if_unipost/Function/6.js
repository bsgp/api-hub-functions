module.exports = async (draft, { request, clone, tryit, file, sql }) => {
  const webhookData = clone(request.body.data);

  const statusList = [
    { id: "ENC", uni_id: "10", text: "작성중" },
    { id: "RSC", uni_id: "30", text: "진행중" },
    { id: "DRN", uni_id: "50", text: "수정요청" },
    { id: "DRN", uni_id: "51", text: "반려" },
    { id: "SSC", uni_id: "70", text: "완료" },
  ];

  const consts = tryit(() => webhookData.continfo.contsts, "");
  const apiUserKey = tryit(() => webhookData.continfo.apiUserKey, "");
  const fStatus = statusList.find((item) => item.uni_id === consts);
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
  });

  const updateResult = await sql("mysql", { useCustomRole: false })
    .update(tables.contract.name, { status: fStatus.id })
    .where({ id: apiUserKey })
    .run();

  draft.response.body = {
    webhookData,
    fStatus,
    updateResult,
  };
};
