module.exports = async (draft) => {
  draft.pipe.json.functionName = "ZPP_IF_WMS_PROD_EXEC_RECEIVE";
  draft.pipe.json.dbTable = "TWMS_L_PROCESSRESULT";
  draft.pipe.json.rfcTable = "T_0030";

  draft.pipe.json.fieldConverter = `return {
    MANDT: conv(each.SAPClientCode, 'char'),
    ZPLNU: conv(each.OrderNo, 'char'),
    ZRMZH: conv(each.Sequence, 'numc'),
    ZCONT: conv(each.ResultType, 'char'),
    MATNR: conv(each.ItemCode, 'char'),
    WERKS: conv(each.Plant, 'char'),
    ZLOTN: conv(each.LotNo, 'char'),
    ZBARC: conv(each.BarCode, 'char'),
    ARBPL: conv(each.MachineCode, 'char'),
    STLAL: conv(each.BOMNo, 'char'),
    ZMAT2: conv(each.PackingMaterialCode, 'char'),
    ZLMNG: conv(each.QtyResult, 'numc'),
    ZYMNG: conv(each.QtyNonConform, 'numc'),
    ZXMNG: conv(each.QtyScrap, 'numc'),
    ZHOQT: conv(each.QtyHandOver, 'numc'),
    ZHOTM: conv(each.MachineHourHandOver, 'numc'),
    ZSHIF: conv(each.Shift, 'char'),
    ZPERN: conv(each.WorkerID1, 'numc'),
    ZPERN2: conv(each.WorkerID2, 'numc'),
    ZISDD: conv(each.DateStart, 'dats'),
    ZISDZ: conv(each.TimeStart, 'tims'),
    ZIEDD: conv(each.DateFinish, 'dats'),
    ZIEDZ: conv(each.TimeFinish, 'tims'),
    ZISM1: conv(each.MachineHour, 'numc'),
    ILE01: conv(each.MachineHourUnit, 'char'),
    ZCNCL: conv(each.IsCanceled, 'char'),
    ZSTPL: conv(each.OrderNoCancel, 'char'),
    ZSTZH: conv(each.SequenceCancel, 'numc'),
    GRUND: conv(each.ReasonMachineStop, 'char'),
    ZERFMG: conv(each.WeightReal, 'numc'),
    ZADDQID: conv(each.IsAdded, 'char'),
    // I_ADMIN: conv(each.IsAdmin, 'char'),
  }
  `;
};
