module.exports = async (
  draft,
  { fn, dayjs, sql, env, tryit, makeid, file }
) => {
  const { interfaceID, tables, newData, userID } = draft.json;
  const sqlParams = { useCustomRole: false, stage: env.CURRENT_ALIAS };

  switch (interfaceID) {
    case "IF-CT-102": {
      const contract = fn.getDB_Object(newData, { key: "contract" });
      // const builder = sql("mysql").select(tables.contract.name);
      // const contractValidator = await builder.validator;
      /** create new ContractID by maxID && insert contract table */
      const cYear = fn.convDate(dayjs, new Date(), "YYYY");
      const prefix = [contract.type, cYear].join("");
      const query = sql("mysql", sqlParams)
        .select(tables.contract.name)
        .max("id", { as: "maxID" })
        .where("id", "like", `${prefix}%`);

      const queryResult = await query.run();
      const maxID =
        tryit(() => queryResult.body.list[0].maxID, "0000000000") ||
        "0000000000";
      const contractID = [
        prefix,
        (Number(maxID.substring(5)) + 1).toString().padStart(5, "0"),
      ].join("");

      const createContract = await sql("mysql", sqlParams)
        .insert(tables.contract.name, {
          ...contract,
          id: contractID,
          status: "DRN",
        })
        .run();

      if (createContract.statusCode !== 200) {
        draft.response.body = {
          E_STATUS: "F",
          E_MESSAGE: `Failed save ${tables.contract.name}`,
          createContract,
        };
        draft.response.statusCode = 400;
        return;
      }

      /** insert change table */
      const cContract = await sql("mysql", sqlParams)
        .insert(
          tables["change"].name,
          fn.getChange_Object({
            tableKey: "contract",
            data: { ...contract, id: contractID },
            userID,
            makeid,
            operation: "I",
          })
        )
        .run();
      draft.response.body = {
        cContract,
      };

      /** insert sub table */
      const tableKeys = ["cost_object", "wbs", "bill", "party", "attachment"];
      //"ref_doc"
      const tableListRes = await Promise.all(
        tableKeys.map(async (tableKey) => {
          const tableData = fn.getDB_Object(newData, {
            key: tableKey,
            contractID,
            makeid,
          });
          if (tableData.length === 0) {
            return {
              E_STATUS: "S",
              E_MESSAGE: `no data ${tables[tableKey].name}`,
              result: tableData,
            };
          }
          if (tableKey === "attachment") {
            await Promise.all(
              newData.attachmentList.map(async (fileData) => {
                const { tempFilePath, type, name } = fileData;
                const path = [`${contractID}`, name].join("/");
                const data = await file.get(tempFilePath, {
                  exactPath: true,
                  returnBuffer: true,
                  stage: env.CURRENT_ALIAS,
                });
                const fileResponse = await file.upload(path, data, {
                  contentType: type,
                  stage: env.CURRENT_ALIAS,
                });
                return fileResponse;
              })
            );
          }
          const changeTableData = await sql("mysql", sqlParams)
            .insert(
              tables["change"].name,
              tableData.map((data) =>
                fn.getChange_Object({
                  tableKey,
                  data,
                  userID,
                  makeid,
                  operation: "I",
                })
              )
            )
            .run();
          const postTableData = await sql("mysql", sqlParams)
            .insert(tables[tableKey].name, tableData)
            .run();
          if (
            postTableData.statusCode !== 200 ||
            changeTableData.statusCode !== 200
          ) {
            return {
              E_STATUS: "F",
              E_MESSAGE: `Failed save ${tables[tableKey].name}`,
              changeTableData,
              result: postTableData,
            };
          } else
            return {
              E_STATUS: "S",
              E_MESSAGE: `saved ${tables[tableKey].name}`,
              changeTableData,
              result: postTableData,
            };
        })
      );

      if (tableListRes.find((res) => res.E_STATUS === "F")) {
        draft.response.body = {
          E_STATUS: "F",
          E_MESSAGE: `계약 내용을 저장하는 과정에서 문제가 발생했습니다`,
          contractID,
          tableListRes,
        };
      } else {
        draft.response.body = {
          ...draft.response.body,
          E_STATUS: "S",
          E_MESSAGE: `계약번호: ${contractID}\n생성되었습니다`,
          contractID,
          tableListRes,
        };
      }
      break;
    }
    case "IF-CT-112": {
      /** Post Billing(actual_billing) Interface
       *  들어오는 값들이 신규 생성인지 업데이트인지 확인 필요
       */
      const { contractID, itemID } = newData.form;
      const changed = fn.getDB_Object(newData, {
        key: "actualBillng",
        contractID,
      });
      const queryBuilder = sql("mysql", sqlParams)
        .select(tables.actual_billing.name)
        .where("contract_id", "like", contractID)
        .where(function () {
          this.where("id", "like", itemID).orWhere("parent_id", "like", itemID);
        })
        .whereNot({ deleted: true });
      const queryTableData = await queryBuilder.run();
      const originData = tryit(() => queryTableData.body.list, []);
      const changeList = [];
      // find Deleted
      originData
        .filter((item) => !changed.find((it) => it.id === item.id))
        .forEach((item) =>
          changeList.push({
            index: item.index,
            type: "deleted",
            before: { ...item },
            after: {},
          })
        );
      // find created || changed
      // changed.forEach((item) => {
      //   const beforeObj = originData.find((it) => it.id === item.id);
      //   if (!beforeObj) {
      //     changeList.push({
      //       index: item.index,
      //       type: "created",
      //       before: {},
      //       after: { ...item },
      //     });
      //   } else {
      //     Object.keys(item).forEach((field) => {
      //       if (item[field] !== beforeObj[field]) {
      //         changeList.push({
      //           key: field,
      //           index: item.index,
      //           type: "changed",
      //           before: { ...beforeObj },
      //           after: { ...item },
      //         });
      //       }
      //     });
      //   }
      // });

      draft.response.body = {
        newData,
        originData,
        changed,
        changeList,
        E_STATUS: "F",
        E_MESSAGE: "IF-CT-112",
      };
      break;
    }
    default: {
      draft.response.body = { E_STATUS: "F", E_MESSAGE: "Wrong interfaceID" };
      break;
    }
  }
};
