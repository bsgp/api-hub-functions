// request.body.Data.draft.documentNo "BSG-231120-0003"
// request.body.Data.draft.draftTemplateNo "BSGP-0005-1"
// request.body.Data.draft.draftStatusCode "DRF"
// request.body.Data.draft.draftId 280
// request.body.Data.draft.draftTemplateId 1114
// request.body.Data.draft.draftTemplateType "R"
// request.body.Data.draft.userId 2
// request.body.Data.draft.userName "임시관리자일"
// request.body.Data.draft.organizationId 26
// request.body.Data.draft.organizationName "(주)비에스지파트너스"
// request.body.Data.draft.workflows[].userId
// request.body.Data.draft.workflows[].userName
// request.body.Data.draft.workflows[].orderSeq
// request.body.Data.draft.workflows[].workflowTypeCode
// request.body.Data.draft.workflows[].organizationId
// request.body.Data.draft.workflows[].organizationName

module.exports = async (draft, { request, tryit, file, sql }) => {
  const { ifObj } = draft.json;
  const { stage } = request;

  // const statusMap = {
  //   ""
  // }

  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
    stage,
  });

  const query = sql("mysql", { useCustomRole: false, stage });

  // draft.response.body = {
  //   webhookData,
  //   fStatus,
  //   updateResult,
  //   E_STATUS: updateResult.statusCode === "200" ? "S" : "F",
  // };
  switch (ifObj.InterfaceId) {
    case "IF-CT-003":
      try {
        const reqItem = tryit(() => request.body.Data.draft);

        if (!reqItem) {
          draft.response.body = {
            E_STATUS: "E",
            E_MESSAGE: "request.body.Data.draft에 데이터가 없습니다",
          };
          return;
        }

        const {
          documentNo,
          draftTemplateNo,
          draftStatusCode,
          draftId,
          draftTemplateId,
          draftTemplateType,
          userId,
          userName,
          organizationId,
          organizationName,
        } = reqItem;
        const workflows = reqItem.workflows.map((each) => ({
          userId: each.userId,
          userName: each.userName,
          orderSeq: each.orderSeq,
          workflowTypeCode: each.workflowTypeCode,
          organizationId: each.organizationId,
          organizationName: each.organizationName,
        }));

        const draftContent = JSON.parse(reqItem.draftContent);
        const { contractId } = draftContent.values;

        query
          .update(tables.contract.name, {
            status: "",
          })
          .where({ id: contractId });

        const updateResult = await query.run();

        draft.response.body = {
          E_STATUS: "S",
          E_MESSAGE: "성공",
          updateResult,
          gpro: {
            documentNo,
            draftTemplateNo,
            draftStatusCode,
            draftId,
            draftTemplateId,
            draftTemplateType,
            userId,
            userName,
            organizationId,
            organizationName,
            workflows,
          },
        };
      } catch (ex) {
        draft.response.body = {
          E_STATUS: "E",
          E_MESSAGE: [ex.message, ex.description].filter(Boolean).join(" "),
        };
      }

      break;
    default:
      draft.response.body = {
        E_STATUS: "E",
        E_MESSAGE: "Can not recognize this Interface ID",
      };
      break;
  }
};
