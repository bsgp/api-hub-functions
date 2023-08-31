module.exports = async (draft, { util, sql }) => {
  const { validation, InterfaceID, tables, reqBody, Data } = draft.pipe.json;

  if (!validation || InterfaceID !== "SRM_CREATE_APPROVAL") {
    return;
  }
  if (!(Data.poItems && Data.poItems.length > 0)) {
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "F",
      E_MESSAGE: `Need Order item data`,
    };
    return;
  }
  const table = tables.ORDER_ITEMS.name;
  const data = Data.poItems.map((item) => util.upKeys(item));

  // check isExist
  let isNotExist = true;
  const existList = [];
  await Promise.all(
    data.map(async (item) => {
      const querySys = sql().select(table);
      querySys.where("PO_NUMBER", "like", item.PO_NUMBER);
      const resultSys = await querySys.run();
      if (resultSys.body.list.length > 1) {
        existList.push(item.PO_NUMBER);
        isNotExist = false;
        return;
      }
    })
  );

  if (!isNotExist) {
    draft.response.statusCode = 400;
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "F",
      E_MESSAGE: `이미 등록된 오더입니다: ${existList.join(", ")}`,
    };
    return;
  }
  const user = reqBody.Function.UserId;

  // insert Log
  const dataObj = data.map((item) => {
    return {
      PO_NUMBER: item.PO_NUMBER,
      ITEM_ID: item.ITEM_ID,
      MAT_ID: item.MAT_ID,
      MAT_TEXT: item.MAT_TEXT,
      PO_QTY: item.PO_QTY,
      REST_QTY: item.REST_QTY,
      UNIT: item.UNIT,
      CREATED_BY: user,
    };
  });

  const builder = sql("mysql");

  // dataObj 안에 중복값 체크 필요

  let isValid = true;
  const validResult = [];
  const validator = await builder.validator(table);
  dataObj.every((item) => {
    const result = validator(item);
    if (!result.isValid) {
      isValid = result.isValid;
      validResult.push(result.errorMessage);
    }
    return result.isValid;
  });

  if (!isValid) {
    draft.response.statusCode = 400;
    draft.response.body.validResult = validResult;
    return;
  }

  // const query=dataObj.reduce((acc, obj) => acc.insert(table, obj), builder);
  const query = builder.insert(table, dataObj);
  const result = await query.run();

  if (result.statusCode === 200) {
    draft.response.body.E_STATUS = "S";
    draft.response.body.E_MESSAGE = `접수 처리되었습니다.`;
  } else {
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "F",
      E_MESSAGE: `접수 과정에서 문제가 발생했습니다.`,
      result,
      dataObj,
      validResult,
    };
    draft.response.statusCode = 400;
    return;
  }
};
