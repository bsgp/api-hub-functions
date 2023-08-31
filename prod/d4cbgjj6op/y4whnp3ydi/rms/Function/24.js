module.exports = async (draft) => {
  draft.pipe.json.rfcFunctionName = "ZFI_IF_RMS_ASSET_RETIREMENT";
  draft.pipe.json.rfcParamsGenerator = `return {
    I_UIDNT: each.I_UIDNT,
    I_UTEXT: each.I_UTEXT,
    I_SYSID: each.I_SYSID,
    IS_HEAD: {
      BUKRS: each.BUKRS,
      XBLNR: each.XBLNR,
      ZUONR: each.ZUONR,
      BUDAT: each.BUDAT,
      BKTXT: each.BKTXT,
    }
  };`;
  draft.pipe.json.rfcFieldsGetterForUpdate = `return {
    E_BELNR: result.E_BELNR,
    E_GJAHR: result.E_GJAHR,
  }`;
};
