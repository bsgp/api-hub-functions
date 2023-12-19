module.exports = async (draft, { sql, env, tryit, file, fn, user, makeid }) => {
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
              gpro_draft_name: sc.gpro_draft_name,
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
            apr_status: "",
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
    case "IF-CT-120": {
      const { locked } = file.get("migration/process.json", {
        gziped: true,
        toJSON: true,
        stage: env.CURRENT_ALIAS,
      });
      if (locked) {
        draft.response.body = {
          E_STATUS: "F",
          E_MESSAGE: [
            "Migration이 다른 사용자에 의해",
            "실행 중입니다",
            "잠시 후 실행하세요",
          ].join("\n"),
        };
        break;
      }

      const { list } = newData;
      /** create new ContractID by maxID && insert contract table */
      const migration_Year = "1000";
      const prefix_P = ["P", migration_Year].join("");
      const prefix_S = ["S", migration_Year].join("");
      const queryResult_P = await sql("mysql", sqlParams)
        .select(tables.contract.name)
        .max("id", { as: "maxID" })
        .where("id", "like", `${prefix_P}%`)
        .run();
      const queryResult_S = await sql("mysql", sqlParams)
        .select(tables.contract.name)
        .max("id", { as: "maxID" })
        .where("id", "like", `${prefix_S}%`)
        .run();
      const maxID_P =
        tryit(() => queryResult_P.body.list[0].maxID, "0000000000") ||
        "0000000000";
      const maxID_S =
        tryit(() => queryResult_S.body.list[0].maxID, "0000000000") ||
        "0000000000";

      const partnerList = [];
      const contracts = [
        list
          .filter(({ form }) => form.type === "P")
          .map((data, idx) => {
            // const {form, partyList} = data;
            const contract = fn.getDB_Object(data, { key: "contract", user });
            const contractID = [
              prefix_P,
              (Number(maxID_P.substring(5)) + idx + 1)
                .toString()
                .padStart(5, "0"),
            ].join("");
            const partners = fn.getDB_Object(data, {
              key: "party",
              contractID,
              makeid,
            });
            partnerList.push(...partners);
            return { ...contract, id: contractID };
          }),
        list
          .filter(({ form }) => form.type === "S")
          .map((data, idx) => {
            // const {form, partyList} = data;
            const contract = fn.getDB_Object(data, { key: "contract", user });
            const contractID = [
              prefix_S,
              (Number(maxID_S.substring(5)) + idx + 1)
                .toString()
                .padStart(5, "0"),
            ].join("");
            const partners = fn.getDB_Object(data, {
              key: "party",
              contractID,
              makeid,
            });
            partnerList.push(...partners);
            return { ...contract, id: contractID };
          }),
      ].flat();

      const test =
        file.get("migration/process.json", {
          gziped: true,
          toJSON: true,
          stage: env.CURRENT_ALIAS,
        }) || "sasas";
      const E_STATUS = "F";
      const E_MESSAGE = "???";

      // const contractTableData = await sql("mysql", sqlParams)
      //   .insert(tables.contract.name, contracts)
      //   .run();
      // const partyTableData = await sql("mysql", sqlParams)
      //   .insert(tables.party.name, partnerList)
      //   .run();

      // const E_STATUS =
      //   contractTableData.statusCode === 200 &&
      //   partyTableData.statusCode === 200
      //     ? "S"
      //     : "E";
      // const E_MESSAGE =
      //   E_STATUS === "S"
      //     ? "Success"
      //     : "데이터 저장과정에서 문제가 발생했습니다";
      draft.response.body = {
        E_STATUS,
        E_MESSAGE,
        partnerList,
        contracts,
        test,
        // contractTableData,
        // partyTableData,
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
