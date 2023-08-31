module.exports = async (draft) => {
  draft.pipe.json.functionName = "ZPP_IF_GI_EXEC_RECEIVE";
  draft.pipe.json.dbTable = "TWMS_L_WORKINPUTRESULT";
  draft.pipe.json.rfcTable = "T_0040";

  draft.pipe.json.fieldConverter = `return {
    MANDT: conv(each.SAPClientCode, 'char'),
    ZPLNU: conv(each.OrderNo, 'char'),
    ZRMZH: conv(each.Sequence, 'numc'),
    ZPOLN: conv(each.PayOffLine, 'char'),
    ZBARC: conv(each.BarCode, 'char'),
    ZBCDS: conv(each.InputType, 'char'),
    MATNR: conv(each.ItemCode, 'char'),
    ZFQTY: conv(each.QtyRef, 'numc'),
    ZSHIF: conv(each.Shift, 'char'),
    ZPERN: conv(each.WorkerID, 'numc'),
    ZZEXMAT: conv(each.ItemCodeAlter, 'char'),
    ZINPD: conv(each.InputDate, 'dats'),
    ZINPT: conv(each.InputTime, 'tims'),
    ARBPL: conv(each.MachineCode, 'char'),
  }
  `;
};
