module.exports = async (draft, { util, sql }) => {
  const { validation, InterfaceID, tables, reqBody, Data } = draft.pipe.json;
  if (!validation || InterfaceID !== "SRM_CREATE_IDN") {
    return;
  }
  if (
    !(Data.idnHeader && Data.idnHeader.length > 0) ||
    !(Data.idnItems && Data.idnItems.length > 0)
  ) {
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "F",
      E_MESSAGE: `Some data not enough`,
    };
    return;
  }
  // order item 납품수량 확인, 업데이트, idn header, item 생성
  const user = reqBody.Function.UserId;
  const IDN_HEADER_LIST = Data.idnHeader.map((item) =>
    util.upKeys({
      PO_NUMBER: item.PO_NUMBER,
      IDN_ID: item.IDN_ID,
      VENDOR: item.VENDOR,
      VEND_NAME: item.VEND_NAME,
      PURCHASE_GROUP: item.PURCHASE_GROUP,
      PUR_GROUP_NAME: item.PUR_GROUP_NAME,
      NET_VALUE: item.NET_VALUE ? `${item.NET_VALUE}` : undefined,
      CURRENCY: item.CURRENCY,
      DOC_DATE: item.DOC_DATE,
      ARRIVE_DATE: item.ARRIVE_DATE,
      PLANT_TEXT: item.PLANT_TEXT,
      SHIP_TO: item.SHIP_TO,
      TEL: item.TEL,
      EMAIL: item.EMAIL,
      IDN_DESC: item.IDN_DESC,
      CREATED_BY: item.CREATED_BY,
    })
  );
  const IDN_ITEM_LIST = Data.idnItems.map((item) =>
    util.upKeys({
      IDN_ID: item.IDN_ID,
      IDN_ITEM_ID: item.IDN_ITEM_ID,
      PO_NUMBER: item.PO_NUMBER,
      PO_ITEM_ID: item.PO_ITEM_ID,
      MAT_ID: item.MAT_ID,
      MAT_TEXT: item.MAT_TEXT,
      PO_QTY: item.PO_QTY,
      IDN_QTY: item.IDN_QTY,
      UNIT: item.UNIT,
      BATCH_ID: item.BATCH_ID,
      PROD_DATE: item.PROD_DATE,
      EXPIRED_DATE: item.EXPIRED_DATE,
      IS_ORIGIN: item.IS_ORIGIN,
      CREATED_BY: item.CREATED_BY,
    })
  );
  const ERROR_LIST = [];
  draft.response.body = {
    ...draft.response.body,
    user,
    IDN_HEADER_LIST,
    IDN_ITEM_LIST,
    ERROR_LIST,
  };

  const builder = sql("mysql");
  // REST_QTY 확확인
  const updateList = Data.idnItems
    .filter((item) => item.IS_ORIGIN)
    .map((item) => {
      const totalQty = Data.idnItems
        .filter((it) => it.PO_ITEM_ID === item.PO_ITEM_ID)
        .reduce((acc, curr) => {
          const qty = Number(curr.IDN_QTY) || 0;
          acc = acc + qty;
          return acc;
        }, 0);
      return { ...item, totalQty };
    });
  const poList = updateList
    .map((item) => item.PO_NUMBER)
    .filter(
      (po, idx) => updateList.findIndex((it) => it.PO_NUMBER === po) === idx
    );
  const checkPO = builder
    .select(tables.ORDER_ITEMS.name)
    .where("PO_NUMBER", "like", poList);
  const checkResult = await checkPO.run();

  if (checkResult.body.list.length === 0) {
    const E_MESSAGE = "접수처리가 되지 않은 오더입니다.";
    draft.response.body = { E_STATUS: "F", E_MESSAGE };
    return;
  }
  const checkPO_Items = checkResult.body.list;
  const errCount = updateList.reduce((acc, curr) => {
    const fItem = checkPO_Items.find((it) => it.ITEM_ID === curr.PO_ITEM_ID);
    if (!fItem) {
      acc++;
    } else if (Number(fItem.REST_QTY) - Number(curr.totalQty) < 0) {
      acc++;
    }
    return acc;
  }, 0);
  draft.response.body = { ...draft.response.body, checkPO_Items, updateList };
  if (errCount > 0) {
    const E_MESSAGE = "납품 수량이 초과됐습니다.";
    draft.response.body = { ...draft.response.body, E_STATUS: "F", E_MESSAGE };
    return;
  }

  // // PO REST_QTY update
  const updatePO = builder.multi(tables.ORDER_ITEMS.name);

  await Promise.all(
    IDN_ITEM_LIST.map(async (item) => {
      const poTable = tables.ORDER_ITEMS.name;
      const PO_NUMBER = item.PO_NUMBER;
      const queryPO = sql("mysql").select(poTable);
      queryPO
        .where("PO_NUMBER", "like", PO_NUMBER)
        .where("ITEM_ID", "like", item.PO_ITEM_ID);
      const queryPO_Result = await queryPO.run();
      if (queryPO_Result.body.list.length !== 1) {
        ERROR_LIST.push("매칭되는 item이 1개가 아닙니다.");
        return false;
      }
      const PO_DATA = queryPO_Result.body.list[0];
      const patchItem = {
        ...PO_DATA,
        REST_QTY: Number(PO_DATA.REST_QTY) - Number(item.IDN_QTY),
        DEL_QTY: Number(item.IDN_QTY),
        IDN_CREATED_NUMBER: PO_DATA.IDN_CREATED_NUMBER + 1,
        UPDATED_AT: new Date(),
        UPDATED_BY: user,
      };
      updatePO.add(function () {
        this.update(patchItem)
          .where("PO_NUMBER", PO_NUMBER)
          .where("ITEM_ID", item.PO_ITEM_ID);
      });
      return true;
    })
  );

  const updatePO_Result = await updatePO.run();
  if (updatePO_Result.body.code !== "S") {
    draft.response.body = {
      E_MESSAGE: "저장 과정에서 문제가 발생했습니다: 수량업데이트",
      updatePO_Result,
    };
    draft.response.statusCode = "400";
    return;
  }

  let isValid = true;
  const idnTable = tables.IDN_HEADER.name;
  const idnItemTable = tables.IDN_ITEMS.name;

  const header_validator = await builder.validator(idnTable);
  const item_validator = await builder.validator(idnItemTable);
  IDN_HEADER_LIST.every((item) => {
    const result = header_validator(item);
    if (!result.isValid) {
      isValid = result.isValid;
      ERROR_LIST.push(result.errorMessage);
    }
    return result.isValid;
  });
  IDN_ITEM_LIST.every((item) => {
    const result = item_validator(item);
    if (!result.isValid) {
      isValid = result.isValid;
      ERROR_LIST.push(result.errorMessage);
    }
    return result.isValid;
  });

  if (!isValid) {
    draft.response.statusCode = 400;
    draft.response.body.ERROR_LIST = ERROR_LIST;
    return;
  }

  const headerCreate = builder.insert(idnTable, IDN_HEADER_LIST);
  const headerResult = await headerCreate.run();
  const itemCreate = builder.insert(idnItemTable, IDN_ITEM_LIST);
  const itemResult = await itemCreate.run();
  if (headerResult.statusCode === 200 && itemResult.statusCode === 200) {
    draft.response.body.E_STATUS = "S";
    draft.response.body.E_MESSAGE = `납품내역이 저장됐습니다.`;
  } else {
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "F",
      E_MESSAGE: `저장 과정에서 문제가 발생했습니다: 납품서 생성`,
      headerResult,
      itemResult,
    };
    draft.response.statusCode = 400;
    return;
  }
};
