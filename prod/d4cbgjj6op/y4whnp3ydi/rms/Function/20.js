module.exports = async (draft, { request, lib }) => {
  const {
    ifId,
    table,
    //   rfcFunctionName,
    //   rfcParamsGenerator,
    //   rfcFieldsGetterForUpdate,
  } = draft.pipe.json;

  const ifTable = "TBSAP000";

  const { tryit } = lib;
  // const { isArray } = type;

  const { builder } = draft.pipe.ref;
  const { knex } = builder;

  /*
    IFKEY 채번
  */
  // SELECT FN_BI_0001('BI') INTO V_IFKEY  FROM DUAL ;
  const ifKeyFn = `FN_BI_0001('BI')`;
  const numQuery = knex("DUAL").select(knex.raw(ifKeyFn));

  const selResult = await builder.run(numQuery);
  draft.response = selResult;

  const ifKey = selResult.body.list[0][ifKeyFn];

  /*
    ifTable에 기록 insert
  */
  // const currentDateTime = new Date();

  const { I_UIDNT, I_UTEXT, I_SYSID } = request.body.Meta;
  const ifData = {
    IFKEY: ifKey,
    IF_CD: "IF012",
    IF_RSLT_CD: null,
    SEND_DT: knex.raw(`SYSDATE`),
    I_UIDNT,
    I_UTEXT,
    I_SYSID,
    // E_STATUS,
    // E_MESSAGE,
    REG_USR_ID: I_UIDNT,
    REG_DT: knex.raw(`SYSDATE`),
    UPD_USR_ID: I_UIDNT,
    UPD_DT: knex.raw(`SYSDATE`),
  };
  const ifInsertQuery = builder.insert(ifTable, ifData);

  const ifInsertResult = await ifInsertQuery.run();

  draft.response = ifInsertResult;

  /*
    SAP에서 받은 데이터를 TBSAP011에 Insert
  */
  const { T_ITEM } = tryit(() => request.body.Data) || {};
  if (T_ITEM === undefined) {
    draft.response.body = {
      InterfaceId: ifId,
      DbTable: table,
      E_STATUS: "F",
      E_MESSAGE: "body.Data.T_ITEM is required",
    };
    return;
  }
  const dataList = T_ITEM.map((each, index) => {
    return {
      ...each,
      IFSEQ: index + 1,
      IFKEY: ifKey,
    };
  });
  const dataInsertQuery = builder.insert(table, dataList);

  const resultDataInsert = await dataInsertQuery.run();

  draft.response = resultDataInsert;

  if (resultDataInsert.statusCode === 200) {
    draft.response.body = {
      InterfaceId: ifId,
      DbTable: table,
      E_STATUS: "S",
      E_MESSAGE: "성공하였습니다",
    };
  } else {
    draft.response.body = {
      InterfaceId: ifId,
      DbTable: table,
      E_STATUS: "F",
      E_MESSAGE: resultDataInsert.body.message || "실패하였습니다",
    };
  }
};
