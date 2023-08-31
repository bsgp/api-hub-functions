module.exports = async (draft) => {
  draft.pipe.json.rfcFunctionName = "ZCO_RMS_CONTRACT_RECEIVE";
  draft.pipe.json.rfcParamsGenerator = `return {
    I_UIDNT: each.I_UIDNT,
    I_UTEXT: each.I_UTEXT,
    I_SYSID: each.I_SYSID,
    T_DATA: [{
      CONTRACT: each.CONTRACT,
      CGUBUN: each.CGUBUN,
      CKTEXT: each.CKTEXT,
      BUKRS: each.BUKRS,
      KUNNR: each.KUNNR,
      BILGUN: each.BILGUN,
      CSDATE: each.CSDATE,
      CEDATE: each.CEDATE,
      COPERID: each.COPERID,
      RMATNR: each.RMATNR,
      VINUMBER: each.VINUMBER,
      INGUBUN: each.INGUBUN,
      MTGUBUN: each.MTGUBUN,
      LEASE: each.LEASE,
      WAERS: each.WAERS,
      BUDGN: each.BUDGN,
      SALEST: each.SALEST,
      SALESNO: each.SALESNO,
      CSTATUS: each.CSTATUS,
      FLEASE: each.FLEASE,
    }]
  };`;
  // draft.pipe.json.rfcFieldsGetterForUpdate = `return {
  //   E_BELNR: result.E_BELNR,
  //   E_GJAHR: result.E_GJAHR,
  // }`;
};
