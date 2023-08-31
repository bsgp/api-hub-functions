module.exports = async (draft) => {
  draft.pipe.json.rfcFunctionName = "ZFI_IF_RMS_MATERIAL_MASTER";
  draft.pipe.json.rfcParamsGenerator = `return {
    I_UIDNT: each.I_UIDNT,
    I_UTEXT: each.I_UTEXT,
    I_SYSID: each.I_SYSID,
    T_ITEM: [{
      RMATNR: each.RMATNR,
      RMAKTX: each.RMAKTX,
      ITEM_GRP_CD: each.ITEM_GRP_CD,
      ITEM_TY_DTL_CD: each.ITEM_TY_DTL_CD,
      MOYE: each.MOYE,
      DMSTC_CD: each.DMSTC_CD,
      ITEM_TY_CD: each.ITEM_TY_CD,
      CAR_STS_CD: each.CAR_STS_CD,
      BUKRS: each.BUKRS,
      USE_YN: each.USE_YN,
    }]
  };`;
};
