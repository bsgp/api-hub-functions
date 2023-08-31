module.exports = async (draft, { lib }) => {
  const validate = draft.pipe.json.validate;
  if (validate) {
    const { tryit } = lib;
    const getObjPayload = (data, item, type, opt = {}) => {
      const unitCode = tryit(
        () => checkQtyTypeCode(item.unitCode, { isReverse: true }),
        data.totalConfirmedQuantity.unit.id
      );
      const quantityObj = { _value_1: item.ActualQty, unitCode };
      if (type === "report") {
        return {
          ReportingPointUUID: data.uuid,
          ConfirmedQuantity: quantityObj,
        };
      } else {
        const objPayload = {
          ActionCode: item.addRow ? "01" : "02",
          IdentifiedStockID: item.Batch,
        };
        if (type.includes("input")) {
          const obj = {
            ...objPayload,
            SourceLogisticsAreaID: item.sourceLogisticsArea,
            ConfirmationMethodCode: "2",
            ConfirmQuantity: quantityObj,
          };
          if (item.addRow) {
            obj.ProductID = item.Material;
          } else {
            obj.MaterialInputUUID = data.uuid;
          }
          return obj;
        } else if (type === "output") {
          const targetArea = data.targetLogisticsArea.id.replace(/_2/, "");
          return {
            ...objPayload,
            MaterialOutputUUID: data.uuid,
            TargetLogisticsAreaID: opt.changeArea
              ? `${targetArea}_2`
              : targetArea,
            ConfirmedQuantity: quantityObj,
          };
          // } else if (type === "split") {
          //   const targetArea = data.targetLogisticsArea.id.replace(/_2/, "");
          //   return {
          //     ActionCode: "01",
          //     MaterialOutputUUID: data.uuid,
          //     SplitIndicator: true,
          //     TargetLogisticsAreaID: targetArea
          //   };
        }
      }
    };

    const changeGoods = (params) => {
      const { list, form, tConf } = params;
      const InventoryChangeItemGoodsConsumptionInformationForChangeOfStock = [];
      list.forEach((item, idx) => {
        const outputData = tConf.materialOutput.find(
          (input) => input.id === item.Material
        );
        if (outputData) {
          if (Number(item.ActualQty)) {
            const unitCode = tryit(
              () => checkQtyTypeCode(item.unitCode, { isReverse: true }),
              outputData.totalConfirmedQuantity.unit.id
            );
            const area = outputData.targetLogisticsArea.id.replace(/_2/, "");
            InventoryChangeItemGoodsConsumptionInformationForChangeOfStock.push(
              {
                ExternalItemID: `task${idx}`,
                OwnerPartyInternalID: "LGHNH_DR",
                SourceMaterialInternalID: item.Material,
                SourceInventoryRestrictedUseIndicator: false,
                SourceIdentifiedStockID: item.Batch,
                SourceLogisticsAreaID: `${area}_2`,
                TargetMaterialInternalID: item.Material,
                TargetInventoryRestrictedUseIndicator: true,
                TargetIdentifiedStockID: item.Batch,
                TargetLogisticsAreaID: area,
                InventoryItemChangeQuantity: {
                  Quantity: { _value_1: item.ActualQty, unitCode },
                  QuantityTypeCode: unitCode,
                },
              }
            );
          }
        }
      });
      const iPayload = {
        ExternalID: "1",
        SiteID: "DO03",
        TransactionDateTime: `${form.postingDate}T04:00:00.000Z`,
        InventoryChangeItemGoodsConsumptionInformationForChangeOfStock,
      };
      if (
        InventoryChangeItemGoodsConsumptionInformationForChangeOfStock.length >
        0
      ) {
        return { GoodsAndActivityConfirmation: iPayload };
      }
    };

    const Data = draft.pipe.json.data;

    const log = {
      TYPE: Data.route,
      MATERIAL_ID: "",
      ISTOCK_ID: "",
      QUANTITY: "",
      AREA: "",
      CREATED_BY: Data.userID,
      UNIQUE_KEY: draft.pipe.json.uniqueKey,
      PRODUCTION_ORDER_ID: "",
      PRODUCTION_TASK_ID: "",
      TASK_STEP: "",
      CONFIRMATION_ID: "",
      RES_STATUS: "",
      RES_DESC: "",
      PAYLOAD: "",
      userText: Data.userText,
    };
    const form = Data.form;
    const lotInfo = form.task.lotInfo;
    // operationTypeCode: Make(1), Supply(10)
    const opTypeCode = Data.route === "PROD_PICKING" ? "10" : "1";
    const tConf = lotInfo.confirmationGroup.find(
      (confirm) => confirm.productionTask[0].operationTypeCode === opTypeCode
    );
    const materialInput = [];
    const materialOutput = [];
    const itemIDForLog = [];
    const iStockForLog = [];
    const qtyForLog = [];
    const areaForLog = [];
    log.PRODUCTION_ORDER_ID = form.task.taskOrder;
    log.PRODUCTION_TASK_ID = form.task.taskID;
    Data.list.forEach((item) => {
      if (item.ActualQty) {
        itemIDForLog.push(item.Material);
        iStockForLog.push(item.Batch);
        qtyForLog.push(item.ActualQty);
        const inputIdx = tConf.materialInput.findIndex(
          (input) =>
            input.id === item.Material &&
            input.iStock.id === item.Batch &&
            input.sourceLogisticsArea.id === item.sourceLogisticsArea
        );
        const inputData =
          Data.route === "PROD_PICKING"
            ? tConf.materialInput[inputIdx]
            : tConf.materialInput.find(
                (input) =>
                  input.id === item.Material && input.iStock.id === item.Batch
              );
        if (inputData) {
          materialInput.push(getObjPayload(inputData, item, "input"));
          areaForLog.push(item.sourceLogisticsArea);
        }
        if (Data.route === "PROD_PICKING") {
          const outputData = tConf.materialOutput[inputIdx];
          materialOutput.push(getObjPayload(outputData, item, "output"));
        } else {
          // 산출실적인 경우
          let outputData;
          if (tConf.materialOutput.length === 1) {
            outputData = tConf.materialOutput[0];
          } else {
            outputData = tConf.materialOutput.find(
              (output) =>
                output.id === item.Material &&
                output.totalConfirmedQuantity.number === 0 &&
                !output.iStock.id &&
                !output.confirmationFinished
            );
          }
          if (outputData) {
            materialOutput.push(
              getObjPayload(outputData, item, "output", { changeArea: true })
            );
            if (Data.route === "PROD_CONFIRMATION") {
              areaForLog.push(outputData.targetLogisticsArea.id);
            }
          }
        }
      }
    });

    const activity = tConf.activity.map((act) => ({
      ActivityUUID: act.uuid,
    }));

    const cGroup = {};
    if (Data.route === "COMPONENT_CHECK") {
      cGroup.Activity = activity;
      cGroup.MaterialInput = materialInput;
      const outputData = tConf.materialOutput.find(
        (output) =>
          output.id === form.outputMaterialID &&
          output.totalConfirmedQuantity.number === 0
      );
      if (outputData) {
        const output = {
          Material: form.outputMaterialID,
          Batch: form.outputBatchID,
          ActualQty: 0,
        };
        materialOutput.push(getObjPayload(outputData, output, "output"));
        cGroup.MaterialOutput = materialOutput;
      }
    } else if (Data.route === "PROD_CONFIRMATION") {
      // const fReportingPoint = tConf.reportingPoint[0];
      cGroup.Activity = activity;
      tConf.materialInput.forEach((item) => {
        const input = {
          Material: item.id,
          Batch: item.iStock.id,
          unitCode: item.plannedQuantity.unit.id,
          ActualQty: 0,
        };
        return materialInput.push(getObjPayload(item, input, "input"));
      });
      cGroup.MaterialInput = materialInput;
      cGroup.MaterialOutput = materialOutput;
      // const item = {
      //   Material: form.materialID,
      //   Batch: form.batchID,
      //   ActualQty: form.quantity,
      //   unitCode: form.unitCode
      // };
      // cGroup.ReportingPoint = getObjPayload(fReportingPoint, item, "report");
    } else if (Data.route === "PROD_PICKING") {
      cGroup.MaterialInput = materialInput;
      cGroup.MaterialOutput = materialOutput;
    }

    const getPayload = (type, data) => {
      const { postingDate, cGroup, tConf, lotInfo } = data;
      const ConfirmationGroup = type === "TASK" ? cGroup : {};
      const iso = `${postingDate}T04:00:00.000Z`;
      ConfirmationGroup.ConfirmationGroupUUID = tConf.uuid;
      ConfirmationGroup.ProductionTask = tConf.productionTask.map((task) => ({
        ProductionTaskID: task.id,
        ProducionTaskUUID: task.uuid,
        ProcessedOnDateTime: type === "TASK" ? iso : undefined,
        ExecutionDateTime: type === "FINISH" ? iso : undefined,
        ConfirmationCompletedRequiredIndicator:
          type === "FINISH" ? true : undefined,
      }));
      return {
        BasicMessageHeader: {},
        ProductionLot: {
          ProductionLotID: lotInfo.id,
          ProductionLotUUID: lotInfo.uuid,
          ConfirmationGroup,
        },
      };
    };
    const prdData = { cGroup, tConf, lotInfo };
    prdData.postingDate = form.postingDate;

    log.MATERIAL_ID = itemIDForLog.join("/");
    log.ISTOCK_ID = iStockForLog.join("/");
    log.QUANTITY = qtyForLog.join("/");
    log.AREA = areaForLog.join("/");

    const prdPayload = JSON.parse(JSON.stringify(getPayload("TASK", prdData)));

    let splitPayload, movePayload;
    if (Data.route === "PROD_CONFIRMATION") {
      if (!form.isCompleted) {
        // 산출자재 split처리
        const output = prdData.cGroup.MaterialOutput[0];
        output.ConfirmedQuantity._value_1 = 0;
        output.SplitIndicator = true;
        prdData.cGroup.MaterialOutput.push({
          ...output,
          SplitIndicator: false,
        });
        const item = {
          Material: form.materialID,
          Batch: form.batchID,
          ActualQty: 0,
          unitCode: form.unitCode,
        };
        const rPoint = tConf.reportingPoint[0];
        prdData.cGroup.ReportingPoint = getObjPayload(rPoint, item, "report");
        splitPayload = getPayload("TASK", prdData);
      }
      // 산출자재 실적 처리 시 산출품 제한제고 처리
      movePayload = changeGoods({ form, list: Data.list, tConf });
    }

    draft.pipe.json.log = log;
    draft.pipe.json.payloads = {
      prdPayload,
      splitPayload,
      movePayload,
    };
  }

  const checkQtyTypeCode = (typeCode, option = {}) => {
    const { isReverse = false } = option;
    const convertList = {
      KGM: "KG",
      XCS: "CS",
      ZTX: "TX",
      ZTS: "TS",
    };
    if (!isReverse) {
      return convertList[typeCode] || typeCode;
    } else {
      const reverse = Object.keys(convertList).find(
        (key) => convertList[key] === typeCode
      );
      return reverse || typeCode;
    }
  };
};
