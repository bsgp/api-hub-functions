module.exports = async (draft, { request, rfc, lib }) => {
  const {
    ifId,
    table,
    //   rfcFunctionName,
    //   rfcParamsGenerator,
    //   rfcFieldsGetterForUpdate,
    connection: rfcConnection,
  } = draft.pipe.json;

  // const { tryit, type } = lib;
  // const { isArray } = type;

  const [year, month] = lib.adjustTime(new Date(), { months: -1 });
  const rfcResult = await rfc.invoke(
    "Z09CSRMSINTERFACE",
    {
      I_YYYYMM:
        lib.tryit(() => request.body.Parameters.I_YYYYMM) ||
        [year, month].join(""),
    },
    rfcConnection,
    { version: "750" }
  );

  let listFromRfc = [];
  if (rfcResult.statusCode === 200) {
    listFromRfc = rfcResult.body.result.GT_DETAIL_LIST;
    //   const eStatus = rfcResult.body.result.E_STATUS;
    //   const eMessage = rfcResult.body.result.E_MESSAGE;
  }
  if (listFromRfc.length === 0) {
    draft.response.body = {
      InterfaceId: ifId,
      DbTable: table,
      E_STATUS: "F",
      E_MESSAGE: "RFC에서 조회된 데이터가 없습니다",
    };
    draft.pipe.json.terminateFlow = true;
    return;
  }
  draft.response = rfcResult;
};
