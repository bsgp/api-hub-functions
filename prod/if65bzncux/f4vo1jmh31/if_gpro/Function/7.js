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

module.exports = async (
  draft,
  { request, tryit, file, sql, env, flow, fn, dayjs }
) => {
  const { ifObj } = draft.json;
  const { stage } = request;

  const sqlParams = { useCustomRole: false, stage };
  const aprStatusMap = {
    DRF: "LRN",
    REJ: "LRR",
    COM: "LRC",
  };

  const statusMap = await file.get("config/contract_status.json", {
    stage: env.CURRENT_ALIAS,
    gziped: true,
    toJSON: true,
  });

  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
    stage,
  });

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
        const { contractId, status: statusFromDraftContent } =
          draftContent.values;

        // if(draftTemplateNo.startsWith("BSGP_CT_002")){

        // }
        const updateData = {
          apr_status: aprStatusMap[draftStatusCode],
          gpro_document_no: documentNo,
        };

        if (draftStatusCode === "COM") {
          updateData.status = statusMap[statusFromDraftContent].next;
        }
        let contractID;
        if (!contractId) {
          contractID = "t";
        } else contractID = contractId;

        draft.response.body = {
          E_STATUS: "S",
          E_MESSAGE: "성공",
          contractID,
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
          flow,
          sql,
          fn,
          dayjs,
          sqlParams,
          tables,
        };
        // if (!contractId) {
        //   const cYear = fn.convDate(dayjs, new Date(), "YYYY");
        //   const prefix = ["P", cYear].join("");
        //   const query = sql("mysql", sqlParams)
        //     .select(tables.contract.name)
        //     .max("id", { as: "maxID" })
        //     .where("id", "like", `${prefix}%`);

        //   const queryResult = await query.run();
        //   const maxID =
        //     tryit(() => queryResult.body.list[0].maxID, "0000000000") ||
        //     "0000000000";
        //   contractID = [
        //     prefix,
        //     (Number(maxID.substring(5)) + 1).toString().padStart(5, "0"),
        //   ].join("");

        //   await sql("mysql", sqlParams)
        //     .insert(tables.contract.name, { id: contractID, status: "APN" })
        //     .run();
        // } else contractID = contractId;
        // /** contract db update */
        // const updateResult = await sql("mysql", sqlParams)
        //   .update(tables.contract.name, updateData)
        //   .where({ id: contractID })
        //   .run();
        // /** letter_appr db update */
        // const updateApprDBResult = await sql("mysql", sqlParams)
        //   .insert(tables["letter_appr"].name, {
        //     contract_id: contractID,
        //     id: documentNo,
        //     gpro_document_no: documentNo,
        //     gpro_draft_template_no: draftTemplateNo,
        //     gpro_draft_status_code: draftStatusCode,
        //     gpro_draft_id: draftId,
        //     gpro_draft_templateId: draftTemplateId,
        //     gpro_draftTemplateType: draftTemplateType,
        //     gpro_userId: userId,
        //     gpro_userName: userName,
        //     gpro_organizationId: organizationId,
        //     gpro_organizationName: organizationName,
        //     gpro_workflows: JSON.stringify(workflows || []),
        //   })
        //   .onConflict()
        //   .merge()
        //   .run();

        // draft.response.body = {
        //   E_STATUS: "S",
        //   E_MESSAGE: "성공",
        //   updateResult,
        //   updateApprDBResult,
        //   gpro: {
        //     documentNo,
        //     draftTemplateNo,
        //     draftStatusCode,
        //     draftId,
        //     draftTemplateId,
        //     draftTemplateType,
        //     userId,
        //     userName,
        //     organizationId,
        //     organizationName,
        //     workflows,
        //   },
        // };
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
