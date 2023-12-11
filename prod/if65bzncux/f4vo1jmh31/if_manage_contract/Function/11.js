module.exports = async (draft, { sql, env }) => {
  const { tables, newData, interfaceID } = draft.json;
  const sqlParams = { useCustomRole: false, stage: env.CURRENT_ALIAS };

  switch (interfaceID) {
    case "IF-CT-110": {
      // UPDATE_WBS_CONTRACT
      const builder = sql("mysql", sqlParams)
        .update(tables.wbs.name, { last_send_date: newData.last_send_date })
        .where("contract_id", "like", newData.contract_id);
      if (newData.whereInList && newData.whereInList.length > 0) {
        builder.whereIn("id", newData.whereInList);
      }
      const updateResult = await builder.run();
      draft.response.body = {
        updateResult,
        newData,
        E_STATUS: updateResult.statusCode === 200 ? "S" : "F",
        E_MESSAGE:
          updateResult.statusCode === 200
            ? "WBS 업데이트 정보를 저장했습니다"
            : "WBS 업데이트 과정에 문제가 발생했습니다",
      };
      break;
    }
    case "IF-CT-119": {
      // MAPPING_LETTER_AND_CONTRACT
      const { source, target } = newData;
      const contract_id = target.id;
      if (!contract_id) {
        draft.response.body = {
          E_STATUS: "F",
          E_MESSAGE: "요청이 잘못되었습니다",
          source,
          target,
        };
        return;
      }
      /** unmap_letters db update */
      const mappingData = { contract_id, deleted: true };
      const unmapResult = await sql("mysql", sqlParams)
        .update(tables.unmap_letters.name, mappingData)
        .whereIn(
          "id",
          source.map(({ id }) => id)
        )
        .run();

      /** letter_appr db update */
      const updateApprDBResult = await sql("mysql", sqlParams)
        .insert(
          tables.letter_appr.name,
          source.map((sc) => {
            return {
              contract_id,
              id: sc.id,
              gpro_document_no: sc.gpro_document_no,
              gpro_draft_template_no: sc.gpro_draft_template_no,
              gpro_draft_template_name: sc.gpro_draft_template_name,
              gpro_draft_status_code: sc.gpro_draft_status_code,
              gpro_draft_id: sc.gpro_draft_id,
              gpro_draft_templateId: sc.gpro_draft_templateId,
              gpro_draftTemplateType: sc.gpro_draftTemplateType,
              gpro_userId: sc.gpro_userId,
              gpro_userName: sc.gpro_userName,
              gpro_organizationId: sc.gpro_organizationId,
              gpro_organizationName: sc.gpro_organizationName,
              gpro_workflows: JSON.stringify(sc.gpro_workflows || []),
            };
          })
        )
        .onConflict()
        .merge()
        .run();
      /** contract db update */
      const gpro_draft_template_no = source[0].gpro_draft_template_no;
      let updateData;
      switch (gpro_draft_template_no) {
        case "BSGP-0005-2": {
          updateData = {
            apr_status: "LRC",
            gpro_document_no: source[0].id,
          };
          updateData.status = "CDN";
          updateData.seq = (Number(target.seq) + 1).toString();
          break;
        }
        case "BSGP-0005-3": {
          updateData = {
            apr_status: "CNL",
            gpro_document_no: source[0].id,
          };
          updateData.status = "CDN";
          break;
        }
        default:
          break;
      }
      const updateResult = await sql("mysql", sqlParams)
        .update(tables.contract.name, updateData)
        .where({ id: contract_id })
        .run();

      draft.response.body = {
        E_STATUS: "S",
        E_MESSAGE: "매핑이 완료되었습니다",
        source,
        target,
        unmapResult,
        updateApprDBResult,
        updateResult,
      };
      break;
    }
    default: {
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: "Wrong interfaceID",
      };
      break;
    }
  }
};
