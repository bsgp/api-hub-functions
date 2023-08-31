module.exports = async (draft) => {
  // const {
  //   ifId,
  //   table,
  //   rfcFunctionName,
  //   rfcParamsGenerator,
  //   rfcFieldsGetterForUpdate,
  // } = draft.pipe.json;

  // const ifTable = "TBSAP000";

  // const { tryit, type } = lib;
  // const { isArray } = type;

  const builder = draft.pipe.ref.builder;
  const knex = builder.knex;

  // SELECT FN_BI_0001('BI') INTO V_IFKEY  FROM DUAL ;
  const query1 = knex("VXSAP001").select();
  const query2 = knex("VXSAP002").select();
  const query3 = knex("VXSAP003").select();

  const selResult = await builder.run([query1, query2, query3], "Multi");
  draft.response = selResult;

  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "",
    T_VXSAP001: selResult.body.list[0].result,
    T_VXSAP002: selResult.body.list[1].result,
    T_VXSAP003: selResult.body.list[2].result,
  };

  // const list000 = tryit(() => selResult.body.list);

  // if (isArray(list000)) {
  //   if (list000.length === 0) {
  //     draft.response.body = {
  //       InterfaceId: ifId,
  //       DbTable: table,
  //       E_STATUS: "F",
  //       E_MESSAGE: "No items could send to SAP",
  //     };
  //     draft.response.statusCode = 500;
  //     return;
  //   }
  // } else if (list000 === undefined) {
  //   draft.response.body = selResult;
  //   return;
  // }

  // const rfcConnection = draft.pipe.json.connection;

  // const results = [];
  // const length000 = list000.length;
  // for (let index000 = 0; index000 < length000; index000 += 1) {
  //   const each = list000[index000];
  //   const getRfcParameters = new Function("each", rfcParamsGenerator);
  //   const rfcResult = await rfc.invoke(
  //     rfcFunctionName,
  //     getRfcParameters(each),
  //     rfcConnection
  //   );
  //   if (rfcResult.statusCode === 200) {
  //     const eStatus = rfcResult.body.result.E_STATUS;
  //     const eMessage = rfcResult.body.result.E_MESSAGE;
  //     const updateData = { E_STATUS: eStatus, E_MESSAGE: eMessage };
  //     updateData.SEND_DT = new Date();

  //     const updateQuery = builder
  //       .update(ifTable, updateData)
  //       .where("IFKEY", each.IFKEY);
  //     const updateResult = await updateQuery.run();
  //     rfcResult.updateResult = updateResult;

  //     if (rfcFieldsGetterForUpdate) {
  //       const getRfcFieldsForUpdate = new Function(
  //         "result",
  //         rfcFieldsGetterForUpdate
  //       );
  //       const updateData2 = getRfcFieldsForUpdate(rfcResult.body.result);
  //       const updateQuery2 = builder
  //         .update(table, updateData2)
  //         .where("IFKEY", each.IFKEY);
  //       const updateResult2 = await updateQuery2.run();
  //       rfcResult.updateResult2 = updateResult2;
  //     }
  //   }
  //   rfcResult.data = each;
  //   results.push(rfcResult);
  // }

  // draft.response.body = results;
};
