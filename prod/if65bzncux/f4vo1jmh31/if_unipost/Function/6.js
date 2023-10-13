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
  const fStatus = statusList.find((item) => item.uni_id === consts);
  if (fStatus) {
    draft.response.body = {
      webhookData,
      E_STATUS: "F",
      E_MESSAGE: "Cannot find status at statusList",
    };
  }
  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });

  const updateResult = await sql("mysql", { useCustomRole: false })
    .update(tables.contract.name, { status: fStatus.id })
    .where({ id: "contractID" })
    .run();

  draft.response.body = {
    webhookData,
    consts,
    fStatus,
    updateResult,
  };
};
