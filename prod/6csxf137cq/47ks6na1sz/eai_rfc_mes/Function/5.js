module.exports = async (draft) => {
  draft.pipe.json.functionName = "ZPP_IF_PLANDORD_NOTX_SEND";
  draft.pipe.json.parameters = {
    I_WERKS: "1000",
    I_FSTAD: "20220501",
    I_FENDD: "20220513",
  };
  draft.pipe.json.dbTable = "TWMS_S_WORKORDER";

  draft.pipe.json.fieldConverter = `return {
    
    ZXSTAT: "S",
    ZXDATS: knex.raw("CONVERT(CHAR(8),GETDATE(),112)"),
    ZXTIMS: knex.raw("REPLACE(CONVERT(CHAR(8),GETDATE(),108),':','')"),
    ZXMSGS: "",
    ZROWSTAT: "C",

    INSERT_ID: "",
    UPDATE_ID: "",
    
    OrderNo: each.PLNUM,
    ItemCode: each.MATNR,
    ItemType: each.MTART,
    CustomerPNo: each.KDMAT,
    ItemName: each.ZZMAKT1,
    ItemSpec: each.ZZGROE,
    ItemColor: each.ZZCOLR,
    ItemLength: each.ZZLENG,
    ItemRemark: each.ZZADDT,
    QtyOrder: each.GSMNG,
    QtyResult: each.ZLMNG,
    Status: each.ZCOMP,
    OrderDateFrom: each.FSTAD,
    OrderTimeFrom: each.FSTAU,
    OrderDateTo: each.FENDD,
    OrderTimeTo: each.FENDU,
    ItemGroup: each.MATKL,
    PackingMaterialGroup: each.MAGRV,
    PackingMaterialCode: each.RMATP,
    PackingMaterialName: each.RMATP_T,
    MachineCode: each.ARBPL,
    BOMNo: each.STALT,
    CountOfComponent: each.ZZLINEQ,
    CountOfComponentResult: each.ZZLINEQ_GI,
    ParentCode: each.ZPEGED,
    BarCode: each.ZBARC,
    PalletNo: each.ZPALLET,
    ProductionVersionDesc: each.TEXT1,
    IsComponentWorking: each.ZPUTCK,
    IsUrgent: each.ZURGNT,
  }
  `;
};
