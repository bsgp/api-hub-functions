module.exports = async (draft) => {
  draft.pipe.json.rfcFunctionName = "ZFI_IF_RMS_DOC_POST";
  draft.pipe.json.rfcParamsGenerator = `return {
    I_UIDNT: each.header.I_UIDNT,
    I_UTEXT: each.header.I_UTEXT,
    I_SYSID: each.header.I_SYSID,
    IS_HEAD: {
      BUKRS: each.header.BUKRS,
      XBLNR: each.header.XBLNR,
      BLART: each.header.BLART,
      BLDAT: each.header.BLDAT,
      BUDAT: each.header.BUDAT,
      BKTXT: each.header.BKTXT,
      BVORG: each.header.BVORG,
      WAERS: each.header.WAERS,
    },
    T_ITEM: each.items.map(item => ({
      BSCHL: item.BSCHL,
      HKONT: item.HKONT,
      KUNNR: item.KUNNR,
      LIFNR: item.LIFNR,
      ANLN1: item.ANLN1,
      UMSKZ: item.UMSKZ,
      MWSKZ: item.MWSKZ,
      WRBTR: item.WRBTR,
      WMWST: item.WMWST,
      KOSTL: item.KOSTL,
      ZFBDT: item.ZFBDT,
      SGTXT: item.SGTXT,
      MATNR: item.MATNR,
      MENGE: item.MENGE,
      XREF1: item.XREF1,
      ZUONR: item.ZUONR,
      RKE_KNDNR: item.RKE_KNDNR,
    }))
  };`;
  draft.pipe.json.rfcFieldsGetterForUpdate = `return {
    E_BELNR: result.E_BELNR,
    E_GJAHR: result.E_GJAHR,
  }`;
};
