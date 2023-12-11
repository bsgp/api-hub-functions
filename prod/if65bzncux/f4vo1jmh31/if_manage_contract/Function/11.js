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
        .where({ id: source.id })
        .run();

      /** letter_appr db update */
      const updateApprDBResult = await sql("mysql", sqlParams)
        .insert(tables.letter_appr.name, {
          contract_id,
          id: target.id,
          gpro_document_no: target.gpro_document_no,
          gpro_draft_template_no: target.gpro_draft_template_no,
          gpro_draft_template_name: target.gpro_draft_template_name,
          gpro_draft_status_code: target.gpro_draft_status_code,
          gpro_draft_id: target.gpro_draft_id,
          gpro_draft_templateId: target.gpro_draft_templateId,
          gpro_draftTemplateType: target.gpro_draftTemplateType,
          gpro_userId: target.gpro_userId,
          gpro_userName: target.gpro_userName,
          gpro_organizationId: target.gpro_organizationId,
          gpro_organizationName: target.gpro_organizationName,
          gpro_workflows: JSON.stringify(target.gpro_workflows || []),
        })
        .onConflict()
        .merge()
        .run();
      /** contract db update */
      const updateData = {
        apr_status: "LRC",
        gpro_document_no: target.id,
      };
      updateData.status = "CDN";
      updateData.seq = (Number(target.seq) + 1).toString();
      /** contract db update */
      const updateResult = await sql("mysql", sqlParams)
        .update(tables.contract.name, updateData)
        .where({ id: contract_id })
        .run();

      draft.response.body = {
        E_STATUS: "S",
        E_MESSAGE: "준비중",
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
