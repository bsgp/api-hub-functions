module.exports = async (draft, { sql, env, tryit, fn, dayjs, user }) => {
  const { tables, newData, interfaceID } = draft.json;
  const sqlParams = { useCustomRole: false, stage: env.CURRENT_ALIAS };

  switch (interfaceID) {
    case "IF-CT-105": {
      // 계약리스트 조회
      const queryBuilder = sql("mysql", sqlParams)
        .select(tables.contract.name)
        .select(
          `${tables.contract.name}.*`,
          `${tables.party.name}.contract_id`,
          `${tables.party.name}.ref_id`,
          `${tables.party.name}.stems10`,
          `${tables.party.name}.name as party_name`,
          `${tables.party.name}.deleted as party_deleted`
        )
        .leftJoin(
          tables.party.name,
          `${tables.contract.name}.id`,
          "=",
          `${tables.party.name}.contract_id`
        );

      if (newData.contractID) {
        queryBuilder.where(
          `${tables.contract.name}.id`,
          "like",
          `%${newData.contractID}%`
        );
      }
      if (newData.partyID) {
        queryBuilder.where("ref_id", "like", newData.partyID);
      }
      const { contractDate, dateRange, dateType } = newData;
      if (contractDate && contractDate[0] && contractDate[1]) {
        const from = fn.convDate(dayjs, contractDate[0], "YYYYMMDD");
        const to = fn.convDate(dayjs, contractDate[1], "YYYYMMDD");
        queryBuilder.whereBetween(`prod_date`, [from, to]);
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        const from = fn.convDate(dayjs, dateRange[0], "YYYYMMDD");
        const to = fn.convDate(dayjs, dateRange[1], "YYYYMMDD");
        queryBuilder.whereBetween(dateType, [from, to]);
      }
      if (newData.contractType) {
        queryBuilder.where(
          `${tables.contract.name}.type`,
          "like",
          newData.contractType
        );
      }
      if (newData.contractStatus) {
        queryBuilder.where("status", "like", newData.contractStatus);
      }
      if (newData.contractName) {
        queryBuilder.where(
          `${tables.contract.name}.name`,
          "like",
          `%${newData.contractName}%`
        );
      }
      if (newData.bukrs) {
        queryBuilder.whereIn("bukrs", [newData.bukrs]);
      } else if (!(user.bukrs || "").includes("*")) {
        const allowBURKS = [user.bukrs];
        if (user.bukrs === "1000") {
          allowBURKS.push("");
        }
        queryBuilder.whereIn("bukrs", allowBURKS);
      }
      queryBuilder.orderBy("created_at", "desc");
      const queryResult = await queryBuilder.run();
      const list = tryit(
        () => queryResult.body.list.map((it) => ({ ...it })),
        []
      );

      draft.response.body = {
        request: newData,
        queryResult,
        list: list
          .reduce((acc, curr) => {
            const isExist = acc.findIndex(({ id }) => id === curr.id);
            if (isExist >= 0) {
              const { type, stems10, party_deleted } = curr;
              if (type === "P" && stems10 === "2" && !party_deleted) {
                acc[isExist] = curr;
              }
              if (type === "S" && stems10 === "1" && !party_deleted) {
                acc[isExist] = curr;
              }
            } else acc.push(curr);
            return acc;
          }, [])
          .map(({ party_name, stems10, type, ...args }) => {
            let name = "";
            if (type === "P" && stems10 === "2") {
              name = party_name;
            }
            if (type === "S" && stems10 === "1") {
              name = party_name;
            }
            return { ...args, type, party_name: name };
          }),
        // test: fn.convDate(dayjs, newData.contractDate[0], "YYYYMMDD"),
        E_STATUS: "S",
        E_MESSAGE: `조회가\n완료되었습니다`,
      };
      break;
    }
    case "IF-CT-115": {
      // 청구리스트 조회
      if (newData.version === "2") {
        const queryBuilder = sql("mysql", sqlParams)
          .select(tables.cost_object.name)
          .select(
            `${tables.cost_object.name}.*`,
            `${tables.contract.name}.id as contract_id`,
            `${tables.contract.name}.name as contract_name`,
            `${tables.contract.name}.renewal_ind`,
            `${tables.contract.name}.bukrs`,
            `${tables.contract.name}.start_date`,
            `${tables.contract.name}.end_date`,
            `${tables.contract.name}.curr_key`,
            `${tables.party.name}.contract_id`,
            `${tables.party.name}.ref_id`,
            `${tables.party.name}.stems10`,
            `${tables.party.name}.name as party_name`,
            `${tables.party.name}.deleted as party_deleted`
          )
          .leftJoin(
            tables.contract.name,
            `${tables.cost_object.name}.contract_id`,
            "=",
            `${tables.contract.name}.id`
          )
          .leftJoin(
            tables.party.name,
            `${tables.cost_object.name}.contract_id`,
            "=",
            `${tables.party.name}.contract_id`
          );

        queryBuilder.where("stems10", "like", "1");
        queryBuilder
          .where(`${tables.contract.name}.type`, "like", "S")
          .whereNot(`${tables.cost_object.name}.deleted`, true)
          .whereNot(`${tables.party.name}.deleted`, true);

        const { post_date, dateRange, dateType } = newData;
        if (post_date && post_date[0] && post_date[1]) {
          const from = fn.convDate(dayjs, post_date[0], "YYYYMMDD");
          const to = fn.convDate(dayjs, post_date[1], "YYYYMMDD");
          queryBuilder.whereBetween("post_date", [from, to]);
        }
        if (dateRange && dateRange[0] && dateRange[1]) {
          const from = fn.convDate(dayjs, dateRange[0], "YYYYMMDD");
          const to = fn.convDate(dayjs, dateRange[1], "YYYYMMDD");
          if (dateType === "post_date") {
            queryBuilder.whereBetween(`${tables.cost_object.name}.post_date`, [
              from,
              to,
            ]);
          } else {
            const key = [tables.contract.name, dateType].join(".");
            queryBuilder.whereBetween(key, [from, to]);
          }
        }
        if (newData.contractID) {
          queryBuilder.where(
            `${tables.contract.name}.id`,
            "like",
            `%${newData.contractID}%`
          );
        }
        if (newData.contractName) {
          queryBuilder.where(
            `${tables.contract.name}.name`,
            "like",
            `%${newData.contractName}%`
          );
        }
        if (newData.partyID) {
          queryBuilder.where(
            `${tables.party.name}.ref_id`,
            "like",
            newData.partyID
          );
        }
        if (newData.cost_object_id) {
          queryBuilder.where("cost_object_id", "like", newData.cost_object_id);
        }
        if (newData.cost_type_id) {
          queryBuilder.where("cost_type_id", "like", newData.cost_type_id);
        }
        if (!(user.bukrs || "").includes("*")) {
          const allowBURKS = [user.bukrs];
          if (user.bukrs === "1000") {
            allowBURKS.push("");
          }
          queryBuilder.whereIn("bukrs", allowBURKS);
        }

        const queryResult = await queryBuilder.run();
        const list = tryit(
          () => queryResult.body.list.map((it) => ({ ...it })),
          []
        );

        draft.response.body = {
          request: newData,
          queryResult,
          list: list
            .filter(
              ({ bill_from_id, ref_id }) =>
                bill_from_id === "" || bill_from_id === ref_id
            )
            .sort((al, be) => {
              if (al.post_date !== be.post_date) {
                return Number(al.post_date) - Number(be.post_date);
              }
              if (al.contract_id === be.contract_id) {
                return Number(al.index) - Number(be.index);
              } else
                return (
                  Number(al.contract_id.replace(/[A-z]/g, "")) -
                  Number(be.contract_id.replace(/[A-z]/g, ""))
                );
            }),

          E_STATUS: "S",
          E_MESSAGE: `조회가\n완료되었습니다 version2`,
        };
        return;
      }
      const queryBuilder = sql("mysql", sqlParams)
        .select(tables.cost_object.name)
        .select(
          `${tables.cost_object.name}.*`,
          `${tables.contract.name}.id as contract_id`,
          `${tables.contract.name}.name as contract_name`,
          `${tables.contract.name}.renewal_ind`,
          `${tables.contract.name}.bukrs`,
          `${tables.contract.name}.start_date`,
          `${tables.contract.name}.end_date`,
          `${tables.contract.name}.curr_key`,
          `${tables.party.name}.contract_id`,
          `${tables.party.name}.ref_id`,
          `${tables.party.name}.stems10`,
          `${tables.party.name}.name as party_name`,
          `${tables.party.name}.deleted as party_deleted`,
          `${tables.actual_billing.name}.fi_gjahr`,
          `${tables.actual_billing.name}.fi_number`
        )
        .leftJoin(
          tables.contract.name,
          `${tables.cost_object.name}.contract_id`,
          "=",
          `${tables.contract.name}.id`
        )
        .leftJoin(
          tables.party.name,
          `${tables.cost_object.name}.contract_id`,
          "=",
          `${tables.party.name}.contract_id`
        )
        .leftJoin(tables.actual_billing.name, (builder) => {
          builder
            .on(
              `${tables.cost_object.name}.contract_id`,
              `${tables.actual_billing.name}.contract_id`
            )
            .on(
              `${tables.cost_object.name}.id`,
              `${tables.actual_billing.name}.id`
            );
        });

      queryBuilder.where("stems10", "like", "1");
      queryBuilder
        .where(`${tables.contract.name}.type`, "like", "S")
        .whereNot(`${tables.cost_object.name}.deleted`, true)
        .whereNot(`${tables.party.name}.deleted`, true);

      const { post_date, dateRange, dateType } = newData;
      if (post_date && post_date[0] && post_date[1]) {
        const from = fn.convDate(dayjs, post_date[0], "YYYYMMDD");
        const to = fn.convDate(dayjs, post_date[1], "YYYYMMDD");
        queryBuilder.whereBetween("post_date", [from, to]);
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        const from = fn.convDate(dayjs, dateRange[0], "YYYYMMDD");
        const to = fn.convDate(dayjs, dateRange[1], "YYYYMMDD");
        if (dateType === "post_date") {
          queryBuilder.whereBetween(`${tables.cost_object.name}.post_date`, [
            from,
            to,
          ]);
        } else {
          const key = [tables.contract.name, dateType].join(".");
          queryBuilder.whereBetween(key, [from, to]);
        }
      }
      if (newData.contractID) {
        queryBuilder.where(
          `${tables.contract.name}.id`,
          "like",
          `%${newData.contractID}%`
        );
      }
      if (newData.contractName) {
        queryBuilder.where(
          `${tables.contract.name}.name`,
          "like",
          `%${newData.contractName}%`
        );
      }
      if (newData.partyID) {
        queryBuilder.where(
          `${tables.party.name}.ref_id`,
          "like",
          newData.partyID
        );
      }
      if (newData.cost_object_id) {
        queryBuilder.where("cost_object_id", "like", newData.cost_object_id);
      }
      if (newData.cost_type_id) {
        queryBuilder.where("cost_type_id", "like", newData.cost_type_id);
      }
      if (!(user.bukrs || "").includes("*")) {
        const allowBURKS = [user.bukrs];
        if (user.bukrs === "1000") {
          allowBURKS.push("");
        }
        queryBuilder.whereIn("bukrs", allowBURKS);
      }

      const queryResult = await queryBuilder.run();
      const list = tryit(
        () => queryResult.body.list.map((it) => ({ ...it })),
        []
      );

      draft.response.body = {
        request: newData,
        queryResult,
        list: list
          .filter(
            ({ bill_from_id, ref_id }) =>
              bill_from_id === "" || bill_from_id === ref_id
          )
          .sort((al, be) => {
            if (al.post_date !== be.post_date) {
              return Number(al.post_date) - Number(be.post_date);
            }
            if (al.contract_id === be.contract_id) {
              return Number(al.index) - Number(be.index);
            } else
              return (
                Number(al.contract_id.replace(/[A-z]/g, "")) -
                Number(be.contract_id.replace(/[A-z]/g, ""))
              );
          }),

        E_STATUS: "S",
        E_MESSAGE: `조회가\n완료되었습니다`,
      };
      break;
    }
    case "IF-CT-118": {
      // GET_UNMAP_LETTER_FROM_DB
      const DB_TABLE = tables.unmap_letters.name;
      const queryBuilder = sql("mysql", sqlParams).select(DB_TABLE);

      const { includeALL, dateRange } = newData; // dateType
      if (!includeALL) {
        queryBuilder.whereNot(`${DB_TABLE}.deleted`, true);
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        const from = fn.convDate(dayjs, dateRange[0], "YYYYMMDD");
        const to = fn.convDate(dayjs, dateRange[1], "YYYYMMDD");
        queryBuilder.whereBetween(`${DB_TABLE}.post_date`, [from, to]);
      }
      if (newData.gpro_document_no) {
        queryBuilder.where(
          `${DB_TABLE}.gpro_document_no`,
          "like",
          `%${newData.gpro_document_no}%`
        );
      }
      if (newData.gpro_draft_template_name) {
        queryBuilder.where(
          `${DB_TABLE}.gpro_draft_template_name`,
          "like",
          `%${newData.gpro_draft_template_name}%`
        );
      }
      const queryResult = await queryBuilder.run();
      const list = tryit(
        () => queryResult.body.list.map((it) => ({ ...it })),
        []
      );

      draft.response.body = {
        request: newData,
        list: list
          .sort((al, be) => {
            if (al.post_date !== be.post_date) {
              return Number(al.post_date) - Number(be.post_date);
            } else
              return (
                Number(al.gpro_document_no.replace(/[A-z]||-/g, "")) -
                Number(be.gpro_document_no.replace(/[A-z]||-/g, ""))
              );
          })
          .map((it, idx) => ({ ...it, index: idx + 1 })),
        E_STATUS: "S",
        E_MESSAGE: `조회가\n완료되었습니다`,
      };
      break;
    }
    default: {
      draft.response.body = {
        request: newData,
        list: [],
        E_STATUS: "F",
        E_MESSAGE: `Wrong interface id`,
      };
      break;
    }
  }
};
