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
      draft.response.body = {
        E_STATUS: "S",
        E_MESSAGE: "준비중",
        source,
        target,
        unmapResult,
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
