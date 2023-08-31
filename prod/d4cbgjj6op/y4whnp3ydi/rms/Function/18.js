module.exports = async (draft, { request, lib }) => {
  const {
    ifId,
    table,
    //   rfcFunctionName,
    //   rfcParamsGenerator,
    //   rfcFieldsGetterForUpdate,
  } = draft.pipe.json;

  const { tryit } = lib;

  const { builder } = draft.pipe.ref;
  const { knex } = builder;
  const { REQ_DOCNO, RSTATUS, REQ_DATE, APV_SABUN, APV_OPINION } =
    request.body.Data;

  const numQuery = knex.raw(
    `CALL SP_CM_7001
(
    :IN_TENANT1,
    :IN_TENANT2,
    :IN_APPR_MNG_NO,
    :IN_APPR_STS_CD,
    :IN_APPR_DE,
    :IN_APPR_NO,
    :IN_APPR_OPINION,
    :OUT_RETN_CD,
    :OUT_SUCC_YN
)`
  );

  const selResult = await builder.run(
    numQuery,
    "Single",
    {},
    {
      IN_TENANT1: "70000",
      IN_TENANT2: "70001",
      IN_APPR_MNG_NO: REQ_DOCNO,
      IN_APPR_STS_CD: RSTATUS,
      IN_APPR_DE: REQ_DATE,
      IN_APPR_NO: APV_SABUN,
      IN_APPR_OPINION: APV_OPINION,
      OUT_RETN_CD: {
        dir: "BIND_OUT",
        type: "STRING",
        // maxSize: 2,
      },
      OUT_SUCC_YN: {
        dir: "BIND_OUT",
        type: "STRING",
        // maxSize: 2,
      },
    }
  );
  // draft.response = selResult;

  const { OUT_SUCC_YN, OUT_RETN_CD } =
    tryit(() => selResult.body.outBinds) || {};

  if (selResult.statusCode === 200) {
    if (OUT_SUCC_YN === "Y") {
      draft.response.body = {
        InterfaceId: ifId,
        DbTable: table,
        E_STATUS: "S",
        E_MESSAGE: "성공하였습니다",
        OUT_SUCC_YN,
        OUT_RETN_CD,
      };
      return;
    }
  }

  draft.response.body = {
    InterfaceId: ifId,
    DbTable: table,
    E_STATUS: "F",
    E_MESSAGE: selResult.body.message || "실패하였습니다",
    OUT_SUCC_YN,
    OUT_RETN_CD,
  };
};
