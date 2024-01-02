module.exports = async (draft, { sql, env, tryit, fn, dayjs, user }) => {
  const { tables, newData, interfaceID } = draft.json;
  const sqlParams = { useCustomRole: false, stage: env.CURRENT_ALIAS };

  switch (interfaceID) {
    case "IF-CT-105": {
      // 계약리스트 조회
      const queryBuilder = sql("mysql", sqlParams)
        .select(`${tables.contract.name} as contract`)
        .select(
          `contract.*`,
          `party.contract_id`,
          `party.ref_id`,
          `party.stems10`,
          `party.name as party_name`,
          `party.deleted as party_deleted`
        );

      if (newData.partyID) {
        queryBuilder.leftJoin(`${tables.party.name} as party`, function () {
          this.on(`party.contract_id`, `contract.id`);
          this.onNotIn("party.deleted", [true]);
        });
        queryBuilder.where("ref_id", "like", newData.partyID);
      } else {
        queryBuilder
          .leftJoin(`${tables.party.name} as party`, function () {
            this.on(`party.contract_id`, `contract.id`)
              .onNotIn("party.deleted", [true])
              .onNotIn("party.ref_id", ["1000", "KR01", "US01"]);
          })
          .groupBy("contract.id"); //매출인 경우 partner가 1개 이상일 수 있음
      }

      if (newData.contractType) {
        queryBuilder.where(`contract.type`, "like", newData.contractType);
      }
      if (newData.contractID) {
        queryBuilder.where(`contract.id`, "like", `%${newData.contractID}%`);
      }
      const { contractDate, dateRange, dateType } = newData;
      if (contractDate && contractDate[0] && contractDate[1]) {
        const from = fn.convDate(dayjs, contractDate[0], "YYYYMMDD");
        const to = fn.convDate(dayjs, contractDate[1], "YYYYMMDD");
        queryBuilder.whereBetween(`contract.prod_date`, [from, to]);
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        const from = fn.convDate(dayjs, dateRange[0], "YYYYMMDD");
        const to = fn.convDate(dayjs, dateRange[1], "YYYYMMDD");
        queryBuilder.whereBetween(`contract.${dateType}`, [from, to]);
      }
      if (newData.contractStatus) {
        queryBuilder.where("contract.status", "like", newData.contractStatus);
      }
      if (newData.contractName) {
        queryBuilder.where(
          `contract.name`,
          "like",
          `%${newData.contractName}%`
        );
      }
      if (newData.bukrs) {
        queryBuilder.whereIn("contract.bukrs", [newData.bukrs]);
      } else if (!(user.bukrs || "").includes("*")) {
        const allowBURKS = [user.bukrs];
        if (user.bukrs === "1000") {
          allowBURKS.push("");
        }
        queryBuilder.whereIn("contract.bukrs", allowBURKS);
      }
      queryBuilder.orderBy([
        { column: "contract.created_at", order: "desc" },
        { column: "contract.id", order: "asc" },
      ]);
      const queryResult = await queryBuilder.run();

      draft.response.body = {
        request: newData,
        list: tryit(() => queryResult.body.list.map((it) => ({ ...it })), []),
        E_STATUS: queryResult.statusCode === 200 ? "S" : "F",
        E_MESSAGE:
          queryResult.statusCode === 200
            ? `조회가\n완료되었습니다`
            : "조회 과정에서 문제가\n발생했습니다",
      };
      if (draft.response.body.E_STATUS !== "S") {
        draft.response.body.queryResult = queryResult;
      }

      break;
    }
    case "IF-CT-115": {
      // 청구리스트 조회
      const queryBuilder = sql("mysql", sqlParams)
        .select(`${tables.cost_object.name} as bills`)
        .select(
          `bills.*`,
          `contract.id as contract_id`,
          `contract.name as contract_name`,
          `contract.renewal_ind`,
          `contract.bukrs`,
          `contract.start_date`,
          `contract.end_date`,
          `contract.curr_key`,
          `party.contract_id`,
          `party.ref_id`,
          `party.stems10`,
          `party.name as party_name`,
          `party.deleted as party_deleted`
        )
        .leftJoin(`${tables.contract.name} as contract`, function () {
          this.on(`contract.id`, `bills.contract_id`);
          this.onIn(`contract.type`, ["S"]);
        })
        .leftJoin(`${tables.party.name} as party`, function () {
          this.on(`party.contract_id`, `bills.contract_id`);
          this.onIn("party.stems10", ["1"]);
          this.onNotIn("party.deleted", [true]);
        });

      queryBuilder
        .where(`contract.type`, "like", "S")
        .whereNot(`bills.deleted`, true);

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
          queryBuilder.whereBetween(`bills.post_date`, [from, to]);
        } else {
          const key = [tables.contract.name, dateType].join(".");
          queryBuilder.whereBetween(key, [from, to]);
        }
      }
      if (newData.contractID) {
        queryBuilder.where(`contract.id`, "like", `%${newData.contractID}%`);
      }
      if (newData.contractName) {
        queryBuilder.where(
          `contract.name`,
          "like",
          `%${newData.contractName}%`
        );
      }
      if (newData.partyID) {
        queryBuilder.where(`party.ref_id`, "like", newData.partyID);
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
        () =>
          queryResult.body.list
            .filter(
              (it) => it.bill_from_id === "" || it.bill_from_id === it.ref_id
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
        []
      );
      const contractIDs = list
        .map(({ contract_id }) => contract_id)
        .filter(
          (id, idx) => list.findIndex((it) => it.contract_id === id) === idx
        );
      const ab_queryResult = await sql("mysql", sqlParams)
        .select(tables.actual_billing.name)
        .select("contract_id", "id", "parent_id", "fi_number", "dmbtr_supply")
        .whereIn("contract_id", contractIDs)
        .whereNot({ deleted: true })
        .run();
      const actual_billing = tryit(() => ab_queryResult.body.list, []);

      const convList = list
        .map((item) => {
          const fBills = (actual_billing || []).filter(
            ({ contract_id, id, parent_id, fi_number }) =>
              contract_id === item.contract_id &&
              (id === item.id || parent_id === item.id) &&
              fi_number
          );
          const sumBillAmt = fBills.reduce((acc, { dmbtr_supply }) => {
            return acc + Number(dmbtr_supply);
          }, 0);
          const totalBillAmt = Math.round(sumBillAmt * 100) / 100;

          let bill_status, bill_status_text;
          if (totalBillAmt === 0) {
            bill_status = "1";
            bill_status_text = "미완료";
          } else if (totalBillAmt !== Number(item.dmbtr_supply)) {
            bill_status = "2";
            bill_status_text = "부분완료";
          } else {
            bill_status = "3";
            bill_status_text = "완료";
          }
          return { ...item, bill_status, bill_status_text };
        })
        .filter(({ bill_status }) => {
          switch (newData.bill_status) {
            case "1":
              return bill_status === "1" || bill_status === "2";
            case "3":
              return bill_status === "3";
            default:
              return true;
          }
        }); // "1": 미완료(부분완료), "3": 완료

      draft.response.body = {
        request: newData,
        list: convList,
        E_STATUS: "S",
        E_MESSAGE: `조회가\n완료되었습니다`,
      };
      if (draft.response.body.E_STATUS !== "S") {
        draft.response.body.queryResult = queryResult;
      }

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
