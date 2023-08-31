module.exports = async (draft) => {
  draft.pipe.json.rfcFunctionName = "ZFI_IF_RMS_DOC_CANCEL";
  draft.pipe.json.rfcParamsGenerator = `return {
    I_UIDNT: each.I_UIDNT,
    I_UTEXT: each.I_UTEXT,
    I_SYSID: each.I_SYSID,
    I_BUKRS: each.I_BUKRS,
    I_BUDAT: each.I_BUDAT,
    I_XBLNR: each.I_XBLNR,
  };`;
  draft.pipe.json.rfcFieldsGetterForUpdate = `return {
    E_BELNR: result.E_BELNR,
    E_GJAHR: result.E_GJAHR,
  }`;
};
