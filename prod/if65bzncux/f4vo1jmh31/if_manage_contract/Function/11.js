module.exports = async (draft, { sql, env }) => {
  const { tables, newData, interfaceID } = draft.json;
  const sqlParams = { useCustomRole: false, stage: env.CURRENT_ALIAS };

  switch (interfaceID) {
    case "IF-CT-110": {
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
    default: {
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: "Wrong interfaceID",
      };
      break;
    }
  }
};
