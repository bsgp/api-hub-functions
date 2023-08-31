module.exports = async (draft) => {
  draft.pipe.json.rfcFunctionName = "ZFI_IF_RMS_DOC_POST_PREMIUM";
  draft.pipe.json.rfcParamsGenerator = `return {
    I_UIDNT: each.I_UIDNT,
    I_UTEXT: each.I_UTEXT,
    I_SYSID: each.I_SYSID,
    IS_HEAD: {
      BUKRS: each.BUKRS,
      IPNO: each.IPNO,
      XBLNR: each.XBLNR,
      XBLNR_P: each.XBLNR_P,
      BLART: each.BLART,
      BLDAT: each.BLDAT,
      BUDAT: each.BUDAT,
      BKTXT: each.BKTXT,
      BVORG: each.BVORG,
      WAERS: each.WAERS,
      ITYPE: each.ITYPE,
      LIFNR: each.LIFNR,
      WRBTR: each.WRBTR,
      KOSTL: each.KOSTL,
      FDATE: each.FDATE,
      CDATE: each.CDATE,
      TDATE: each.TDATE,
      EDATE: each.EDATE,
      XREF1: each.XREF1,
      ZUONR: each.ZUONR,
      INPCY_NO: each.INPCY_NO,
      T_AMT: each.T_AMT,
    }
  };`;
  draft.pipe.json.rfcFieldsGetterForUpdate = `return {
    E_BELNR: result.E_BELNR,
    E_GJAHR: result.E_GJAHR,
  }`;
};
