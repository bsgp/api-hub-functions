module.exports = async (draft, { soap, env, lib, file }) => {
  const { tryit } = lib;
  const wsdlAlias = env.SO_WSDL;
  const certAlias = "dev";
  const tenantID = env.BYD_TENANT;
  const payload = draft.json.salesOrderPayload;
  const fileName = draft.json.fileName;

  if (!payload) {
    return;
  }

  let result;
  try {
    result = await soap(`manage_sales_orders:${wsdlAlias}`, {
      p12ID: `p12test:${certAlias}`,
      tenantID,
      operation: "MaintainBundle",
      payload,
    });
    if (result.statusCode === 200) {
      const body = JSON.parse(result.body);
      await catchFn(body, `/soCreateResult/${fileName}`);
      const salesOrderID = tryit(() => body.SalesOrder[0].ID._value_1, "");
      if (salesOrderID) {
        draft.response.body.E_STATUS = "S";
        draft.response.body.E_MESSAGE = `판매오더:${salesOrderID}가 생성되었습니다.`;
      } else {
        draft.response.body.E_STATUS = "F";
        draft.response.body.E_MESSAGE =
          "판매오더 생성 과정에서 에러가 발생했습니다.";
        await file.move(fileName, `/so_failed/${fileName}`);
      }
      draft.response.body = {
        ...draft.response.body,
        statusCode: result.statusCode,
        body,
      };
    } else throw new Error("soap failed");
  } catch (error) {
    await file.move(fileName, `/so_failed/${fileName}`);
    draft.response.body = {
      ...draft.response.body,
      error: error.message,
      result,
    };
  }
  async function catchFn(data, path = "/sendError/") {
    const now = new Date().toISOString();
    const payloadString = JSON.stringify(data);
    const buf = Buffer.from(payloadString, "utf8").toString();
    await file.upload(path + now, buf, { gzip: true });
  }
};
