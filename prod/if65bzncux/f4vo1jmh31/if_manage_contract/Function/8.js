module.exports = async (draft, { sql, env, tryit, fn, dayjs }) => {
  const { tables, newData, interfaceID } = draft.json;

  switch (interfaceID) {
    case "IF-CT-105": {
      const queryBuilder = sql("mysql", {
        useCustomRole: false,
        stage: env.CURRENT_ALIAS,
      })
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
      // .orderBy(["id",{column:`${tables.party.name}.stems10`,order:"desc"}]);

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
      if (newData.contractDate[0] && newData.contractDate[1]) {
        const from = fn.convDate(dayjs, newData.contractDate[0], "YYYYMMDD");
        const to = fn.convDate(dayjs, newData.contractDate[1], "YYYYMMDD");
        queryBuilder.whereBetween("prod_date", [from, to]);
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
        test: fn.convDate(dayjs, newData.contractDate[0], "YYYYMMDD", 9),
        E_STATUS: "S",
        E_MESSAGE: `조회가\n완료되었습니다`,
      };
      break;
    }
    case "IF-CT-115": {
      const queryBuilder = sql("mysql", {
        useCustomRole: false,
        stage: env.CURRENT_ALIAS,
      })
        .select(tables.cost_object.name)
        .select(
          `${tables.cost_object.name}.*`,
          `${tables.contract.name}.id as contract_id`,
          `${tables.contract.name}.name as contract_name`,
          `${tables.contract.name}.renewal_ind`,
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
      queryBuilder.where(`${tables.contract.name}.type`, "like", "S");
      if (newData.post_date[0] && newData.post_date[1]) {
        const from = fn.convDate(dayjs, newData.post_date[0], "YYYYMMDD");
        const to = fn.convDate(dayjs, newData.post_date[1], "YYYYMMDD");
        queryBuilder.whereBetween("post_date", [from, to]);
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

      const queryResult = await queryBuilder.run();
      const list = tryit(
        () => queryResult.body.list.map((it) => ({ ...it })),
        []
      );

      draft.response.body = {
        request: newData,
        list: list.sort((al, be) => {
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
        E_MESSAGE: `IF-CT-115`,
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
