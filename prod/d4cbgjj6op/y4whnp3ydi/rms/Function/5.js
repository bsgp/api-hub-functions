module.exports = async (draft, { lib, rfc }) => {
  if (draft.response.body.errorMessage) {
    return;
  }

  const {
    ifId,
    table,
    rfcFunctionName,
    rfcParamsGenerator,
    rfcFieldsGetterForUpdate,
  } = draft.pipe.json;

  const ifTable = "TBSAP000";

  const { tryit, type } = lib;
  const { isArray } = type;

  const { builder } = draft.pipe.ref;
  const { knex } = builder;

  const query = builder.select({ a: ifTable }, undefined, {
    fetchDefaultValue: true,
  });
  query.join({ b: table }, ["b", "IFKEY"].join("."), ["a", "IFKEY"].join("."));
  query.whereNull(["a", "SEND_DT"].join("."));
  query.orderBy(["a", "IFKEY"].join("."));

  const selResult = await query.run();
  // draft.response = selResult;

  const list000 = tryit(() => selResult.body.list);

  if (isArray(list000)) {
    if (list000.length === 0) {
      draft.response.body = {
        InterfaceId: ifId,
        DbTable: table,
        E_STATUS: "F",
        E_MESSAGE: [
          "전송할 데이터가 없습니다.",
          `${ifTable}.SEND_DT가 null값인것만 전송대상입니다.`,
          `JOIN ${table}.IFKEY = ${ifTable}.IFKEY`,
        ].join(" "),
      };
      return;
    }
  } else if (list000 === undefined) {
    draft.response.body = selResult;
    return;
  }

  const rfcConnection = draft.pipe.json.connection;

  const results = [];
  const length000 = list000.length;
  for (let index000 = 0; index000 < length000; index000 += 1) {
    const each = list000[index000];
    const getRfcParameters = new Function("each", rfcParamsGenerator);
    const rfcResult = await rfc.invoke(
      rfcFunctionName,
      getRfcParameters(each),
      rfcConnection,
      { version: "750" }
    );

    if (rfcResult.statusCode === 200) {
      const eStatus = rfcResult.body.result.E_STATUS;
      const eMessage = rfcResult.body.result.E_MESSAGE;
      const updateData = { E_STATUS: eStatus, E_MESSAGE: eMessage };
      updateData.SEND_DT = knex.raw(`SYSDATE`);

      const updateQuery = builder
        .update(ifTable, updateData)
        .where("IFKEY", each.IFKEY);
      const updateResult = await updateQuery.run();
      rfcResult.updateResult = updateResult;

      if (rfcFieldsGetterForUpdate) {
        const getRfcFieldsForUpdate = new Function(
          "result",
          rfcFieldsGetterForUpdate
        );
        const updateData2 = getRfcFieldsForUpdate(rfcResult.body.result);
        const updateQuery2 = builder
          .update(table, updateData2)
          .where("IFKEY", each.IFKEY);
        const updateResult2 = await updateQuery2.run();
        rfcResult.updateResult2 = updateResult2;
      }
    }
    rfcResult.data = each;
    results.push(rfcResult);
  }

  draft.response.body = {
    results,
    E_STATUS: "S",
    E_MESSAGE: `${results.length}건을 처리하였습니다`,
  };

  // if (result.body.code === "S") {
  //   draft.response.body = {
  //     InterfaceId: request.body.InterfaceId,
  //     DbTable: table,
  //     E_STATUS: "S",
  //     E_MESSAGE: "성공하였습니다",
  //   };
  // } else {
  //   draft.response.body = {
  //     InterfaceId: request.body.InterfaceId,
  //     DbTable: table,
  //     E_STATUS: "F",
  //     E_MESSAGE: "실패하였습니다",
  //   };
  // }

  //   const entries = dataList.map((each) => {
  //     return {
  //       company: each.BUKRS,
  //       costct: each.KOSTL,
  //       effdt: each.DATAB,
  //       costct_nm: each.KTEXT,
  //     };
  //   });

  //   const query = builder.insert(table, entries);
  //   const result = await query.run();
  //   draft.response = result;

  //   const selQuery = builder.select(table);
  //   const selResult = await selQuery.run();
  // draft.response = selResult;
};
