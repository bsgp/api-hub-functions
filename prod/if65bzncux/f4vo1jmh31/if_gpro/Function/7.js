module.exports = async (draft, { request, tryit }) => {
  const { ifObj } = draft.json;

  switch (ifObj.InterfaceId) {
    case "IF-CT-003":
      try {
        const reqItem = tryit(() => request.body.Data.draft) || {
          workflows: [],
        };
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

        draft.response.body = {
          E_STATUS: "S",
          E_MESSAGE: "성공",
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
