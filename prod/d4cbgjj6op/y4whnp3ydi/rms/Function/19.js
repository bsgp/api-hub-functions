module.exports = async (draft) => {
  draft.pipe.json.rfcFunctionName = "ZFI_IF_CREATE_FIXEDASSET";
  draft.pipe.json.rfcParamsGenerator = `return {
        I_UIDNT: each.I_UIDNT,
        I_UTEXT: each.I_UTEXT,
        I_SYSID: each.I_SYSID,
        I_BUKRS: each.I_BUKRS,
        I_TXT50: each.I_TXT50,
        I_KOSTL: each.I_KOSTL,
        I_INVNR: each.I_INVNR,
      };`;

  draft.pipe.json.rfcFieldsGetterForUpdate = `return {
    SAP_COMPANYCODE: result.ES_ASSET.COMPANYCODE,
    SAP_ASSET: result.ES_ASSET.ASSET,
    SAP_SUBNUMBER: result.ES_ASSET.SUBNUMBER,
  }`;
};
