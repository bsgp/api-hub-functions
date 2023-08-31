module.exports = async (draft, context) => {
  // The "immer" package is used
  draft.pipe.json.ff = "ff";
  context.log("test");
  const result = await context.odata.get({url: "https://my349266.sapbydesign.com/sap/byd/odata/cust/v1/bsg_productionorder/ProductionOrderCollection?$expand=ProductionLot/ProductionLotMaterialInput/ProductionLotMaterialInputLogisticsArea,ProductionLot/ReportingPoint,ProductionLot/ConfirmationGroup/ProductionTask,ProductionLot/ProductionLotMaterialOutput/ProdLotMatOutputLogisticsArea/ProdLotMatOutputLogisticsAreaSite,ProductionLot/ProductionLotMaterialOutput,ProductionLot,ProductionLot/ProductionLotMaterialInput,ProductionOrderMainProductOutput,ProductionLot/ReportingPoint&$filter=ID%20eq%20%2715824%27&sap-language=ko&$format=json&$inlinecount=allpages"});
  context.log(result);
  draft.pipe.json.ff = result;
}
