module.exports = async (draft, { lib, sql, file, soap }) => {
  const validate = draft.pipe.json.validate;
  if (validate) {
    const { tryit } = lib;
    const { prdPayload, splitPayload, movePayload } = draft.pipe.json.payloads;
    const { pid, route } = draft.pipe.json.data;
    const alias = {
      my358322: {
        certAlias: "dmtest1",
        prdWsdlAlias: "test2",
        goodsWsdlAlias: "test1",
      },
      my359276: {
        certAlias: "dmprod1",
        prdWsdlAlias: "prod2",
        goodsWsdlAlias: "prod1",
      },
    };
    const certAlias = alias[pid].certAlias;
    const prdWsdlAlias = alias[pid].prdWsdlAlias;
    const goodsWsdlAlias = alias[pid].goodsWsdlAlias;

    const log = draft.pipe.json.log;
    const taskData = { prdPayload, splitPayload, movePayload, log };
    const result = await file.get("config/tables.json", {
      gziped: true,
      toJSON: true,
    });
    const table = result.log.name;
    const sendLog = (data) =>
      postLog({ sql, file }, table, { ...log, ...data });
    try {
      // 실적처리 전 로그
      await sendLog({ TASK_STEP: "BEFORE_PROD_CONF", PAYLOAD: prdPayload });

      const sendPrdLots = await soap(`manageproductionlotsin:${prdWsdlAlias}`, {
        p12ID: `p12key:${certAlias}`,
        tenantID: pid,
        operation: "MaintainBundle_V1",
        payload: prdPayload,
      });
      if (sendPrdLots.statusCode === 200) {
        const prdResult = JSON.parse(sendPrdLots.body);
        const prdResponse = prdResult.ProductionLotResponse[0];
        taskData.prdResponse = prdResponse;
        const productionLotLog = prdResponse.ProductionLotLog;
        const errorLog = productionLotLog.filter(
          (log) => log.SeverityCode !== "S"
        );
        if (errorLog.length > 0) {
          await sendLog({
            TASK_STEP: "AFTER_PROD_CONF",
            RES_STATUS: errorLog[0].SeverityCode,
            RES_DESC: errorLog[0].Note,
            PAYLOAD: prdResponse,
          });
          throw new Error(errorLog[0].Note);
        }
        await sendLog({
          TASK_STEP: "AFTER_PROD_CONF",
          RES_STATUS: "S",
          RES_DESC: "Saved Successfully",
          PAYLOAD: prdResponse,
        });
      } else throw new Error("ProductionLots error occurred");

      if (route !== "PROD_CONFIRMATION") {
        draft.response.body = {
          E_STATUS: "S",
          E_MESSAGE: "Saved Successfully",
          taskData,
        };
        draft.response.statusCode = 200;
        return;
      }
      // 산출 실적 시 분할처리
      await soap(`manageproductionlotsin:${prdWsdlAlias}`, {
        p12ID: `p12key:${certAlias}`,
        tenantID: pid,
        operation: "MaintainBundle_V1",
        payload: splitPayload,
      });
      if (movePayload) {
        await sendLog({
          TASK_STEP: "BEFORE_CHANGE_GOODS",
          PAYLOAD: movePayload,
        });
        const changeStock = await soap(`goodsconfirmation:${goodsWsdlAlias}`, {
          p12ID: `p12key:${certAlias}`,
          tenantID: pid,
          operation: "DoGoodsChangeOfStock",
          payload: movePayload,
        });
        if (changeStock.statusCode === 200) {
          const changeStockResult = JSON.parse(changeStock.body);
          const changeStockResponse = changeStockResult.GACDetails[0];
          taskData.changeStockResult = changeStockResult;
          const GACID = tryit(() => changeStockResponse.GACID._value_1, "");
          if (!GACID) {
            const logs = tryit(() => changeStockResult.Log.Item[0], {});
            await sendLog({
              TASK_STEP: "AFTER_CHANGE_GOODS",
              RES_STATUS: "E",
              RES_DESC: logs.Note || "Error: Change Goods to restricted failed",
              PAYLOAD: changeStockResult,
            });
            // change goods soap error가 난 경우 한번 더 처리
            const reChangeTask = await soap(
              `goodsconfirmation:${goodsWsdlAlias}`,
              {
                p12ID: `p12key:${certAlias}`,
                tenantID: pid,
                operation: "DoGoodsChangeOfStock",
                payload: movePayload,
              }
            );
            if (reChangeTask.statusCode === 200) {
              const reChangeResult = JSON.parse(reChangeTask.body);
              const rechangeResponse = reChangeResult.GACDetails[0];
              taskData.reChangeResult = reChangeResult;
              const rGACID = tryit(() => rechangeResponse.GACID._value_1, "");
              if (!rGACID) {
                const logs = tryit(() => reChangeResult.Log.Item[0], {});
                await sendLog({
                  TASK_STEP: "AFTER_CHANGE_GOODS(RERUN)",
                  RES_STATUS: "E",
                  RES_DESC:
                    logs.Note || "Error: Change Goods to restricted failed",
                  PAYLOAD: reChangeResult,
                });
                throw new Error(logs.Note);
              } else {
                await sendLog({
                  TASK_STEP: "AFTER_CHANGE_GOODS(RERUN)",
                  CONFIRMATION_ID: rGACID,
                  RES_STATUS: "S",
                  RES_DESC: "Saved Successfully",
                  PAYLOAD: reChangeResult,
                });
              }
            }
          } else {
            await sendLog({
              TASK_STEP: "AFTER_CHANGE_GOODS",
              CONFIRMATION_ID: GACID,
              RES_STATUS: "S",
              RES_DESC: "Saved Successfully",
              PAYLOAD: changeStockResult,
            });
          }
        } else {
          const PAYLOAD = changeStock;
          await sendLog({
            TASK_STEP: "AFTER_CHANGE_GOODS",
            RES_STATUS: "E",
            RES_DESC: "Error: Change Goods request failed",
            PAYLOAD,
          });
          // change goods soap error가 난 경우 한번 더 처리
          const reChangeTask = await soap(
            `goodsconfirmation:${goodsWsdlAlias}`,
            {
              p12ID: `p12key:${certAlias}`,
              tenantID: pid,
              operation: "DoGoodsChangeOfStock",
              payload: movePayload,
            }
          );
          if (reChangeTask.statusCode === 200) {
            const reChangeResult = JSON.parse(reChangeTask.body);
            const rechangeResponse = reChangeResult.GACDetails[0];
            taskData.reChangeResult = reChangeResult;
            const rGACID = tryit(() => rechangeResponse.GACID._value_1, "");
            if (!rGACID) {
              const logs = tryit(() => reChangeResult.Log.Item[0], {});
              await sendLog({
                TASK_STEP: "AFTER_CHANGE_GOODS(RERUN)",
                RES_STATUS: "E",
                RES_DESC:
                  logs.Note || "Error: Change Goods to restricted failed",
                PAYLOAD: reChangeResult,
              });
              throw new Error(logs.Note);
            } else {
              await sendLog({
                TASK_STEP: "AFTER_CHANGE_GOODS(RERUN)",
                CONFIRMATION_ID: rGACID,
                RES_STATUS: "S",
                RES_DESC: "Saved Successfully",
                PAYLOAD: reChangeResult,
              });
            }
          } else {
            await sendLog({
              TASK_STEP: "AFTER_CHANGE_GOODS(RERUN)",
              RES_STATUS: "E",
              RES_DESC: "Error: Change Goods request failed",
              PAYLOAD: reChangeTask,
            });
          }
        }
      }
    } catch (err) {
      const now = new Date().toISOString();
      const payloadString = JSON.stringify(taskData);
      const buf = Buffer.from(payloadString, "utf8").toString();
      await file.upload("/sendproductionLotsError/" + now, buf, { gzip: true });
      draft.response.body = { E_STATUS: "F", E_MESSAGE: err.message, taskData };
      draft.response.statusCode = 500;
      return;
    }

    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: "Saved Successfully",
      taskData,
    };
    draft.response.statusCode = 200;
  }
};

const getPath = (data) => {
  const now = new Date().toISOString();
  const dateSplit = now.split("T");
  const [year, month, date] = dateSplit[0].split("-");
  return [
    `/payload/${year}/${month}/${date}`,
    `/${data.UNIQUE_KEY}/${data.TASK_STEP}.txt`,
  ].join("");
};

const postLog = async (context, table, data) => {
  const { sql, file } = context;
  const builder = sql("mysql");
  const validator = await builder.validator(table);
  const savePath = getPath(data);
  // insert Log
  const logObj = {
    TYPE: data.TYPE || "",
    MATERIAL_ID: data.MATERIAL_ID || "",
    ISTOCK_ID: data.ISTOCK_ID || "",
    QUANTITY: data.QUANTITY ? `${data.QUANTITY}` : "",
    AREA: data.AREA || "",
    CREATED_BY: data.CREATED_BY,
    UNIQUE_KEY: data.UNIQUE_KEY,
    PRODUCTION_ORDER_ID: data.PRODUCTION_ORDER_ID,
    PRODUCTION_TASK_ID: data.PRODUCTION_TASK_ID,
    TASK_STEP: data.TASK_STEP,
    CONFIRMATION_ID: data.CONFIRMATION_ID,
    RES_STATUS: data.RES_STATUS,
    RES_DESC: data.RES_DESC,
    PAYLOAD_URL: data.PAYLOAD ? savePath : "",
  };
  const validResult = validator(logObj);
  if (!validResult.isValid) {
    return { E_STATUS: "F", E_MESSAGE: validResult.errorMessage };
  }
  const query = builder.insert(table, logObj);
  const result = await query.run();
  if (data.PAYLOAD) {
    const payloadString = JSON.stringify(data.PAYLOAD);
    const buf = Buffer.from(payloadString, "utf8").toString();
    await file.upload(savePath, buf, { gzip: true });
  }
  if (result.statusCode === 200) {
    const queryLOT = sql().select(table);
    Object.keys(logObj).forEach((dataKey) => {
      if (logObj[dataKey]) {
        queryLOT.where(dataKey, "like", logObj[dataKey]);
      }
    });
    const resultLOTs = await queryLOT.run();
    return {
      E_STATUS: "S",
      E_MESSAGE: `log: ${logObj.TASK_STEP}`,
      result: resultLOTs.body,
    };
  } else {
    return { E_STATUS: "F", E_MESSAGE: "Failed save Log.", result };
  }
};
