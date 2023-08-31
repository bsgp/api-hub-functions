module.exports = async (draft, { request, util, sql, file }) => {
  const now = new Date().toISOString();
  const dateSplit = now.split("T");
  const [year, month, date] = dateSplit[0].split("-");

  const { validation, isSatisfied, table } = draft.pipe.json;
  if (!validation) {
    return;
  }
  const reqBody = request.body;
  const data = util.upKeys(reqBody.Data);

  const savePath = [
    `/payload/${year}/${month}/${date}`,
    `/${data.UNIQUE_KEY}/${data.TASK_STEP}.txt`,
  ].join("");

  // insert Log
  let logObj = {
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
  if (!isSatisfied) {
    logObj = {
      ...logObj,
      UNIQUE_KEY: `${Date.now() + Math.random()}`.replace(/\./g, ""),
      TASK_STEP: "DEPRECATED",
      PRODUCTION_ORDER_ID: data.TYPE === "PRODUCTION" ? data.DOC_ID : "",
      CONFIRMATION_ID: data.TYPE === "MOVE" ? data.DOC_ID : "",
      PAYLOAD_URL: "",
    };
  }

  const builder = sql("mysql");

  const validator = await builder.validator(table);
  const validResult = validator(logObj);
  if (!validResult.isValid) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: validResult.errorMessage,
    };
    draft.response.statusCode = 400;
    return;
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
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: `log: ${logObj.TASK_STEP}`,
      result: resultLOTs.body,
    };
  } else {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Failed save Log.",
      result,
    };
    draft.response.statusCode = 400;
    return;
  }
};
