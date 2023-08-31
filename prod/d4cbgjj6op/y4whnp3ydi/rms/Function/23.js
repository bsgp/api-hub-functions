module.exports = async (draft) => {
  draft.pipe.json.rfcFunctionName = "ZFI_IF_RMS_VIN_MASTER";
  draft.pipe.json.rfcParamsGenerator = `return {
    I_UIDNT: each.I_UIDNT,
    I_UTEXT: each.I_UTEXT,
    I_SYSID: each.I_SYSID,
    T_ITEM: [{
      BUKRS: each.BUKRS,
      ZUONR: each.ZUONR,
      MATNR: each.MATNR,
      WRBTR: each.WRBTR,
      WAERS: each.WAERS,
      XBLNR: each.XBLNR,
      GRADE: each.GRADE,
    }]
  };`;
};
