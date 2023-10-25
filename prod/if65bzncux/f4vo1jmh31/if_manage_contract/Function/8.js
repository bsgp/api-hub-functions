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

      if (newData.partyID) {
        queryBuilder.where("ref_id", "like", newData.partyID);
      } else {
        if (newData.contractDate[0] && newData.contractDate[1]) {
          const from = fn.convDate(dayjs, newData.contractDate[0], "YYYYMMDD");
          const to = fn.convDate(dayjs, newData.contractDate[1], "YYYYMMDD");
          queryBuilder.whereBetween("prod_date", [from, to]);
        }
        if (newData.contractType) {
          queryBuilder.where("type", "like", newData.contractType);
        }
        if (newData.contractStatus) {
          queryBuilder.where("status", "like", newData.contractStatus);
        }
        if (newData.contractID) {
          queryBuilder.where(
            `${tables.contract.name}.id`,
            "like",
            `%${newData.contractID}%`
          );
        }
        if (newData.contractName) {
          queryBuilder.where("name", "like", `%${newData.contractName}%`);
        }
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
      draft.response.body = {
        request: newData,
        list: [],
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
