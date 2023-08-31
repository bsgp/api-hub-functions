module.exports = async (draft, { soap, env, lib, file }) => {
  const { tryit } = lib;
  const wsdlAlias = "dev";
  const tenantID = env.BYD_TENANT;
  const params = draft.json.params;
  const payload = {
    BasicMessageHeader: {},
    GoodsAndServiceAcknowledgement: {
      actionCode: "01",
      BusinessTransactionDocumentTypeCode: "282",
      Date: params.form.deliveryDate,
      PostGSAIndicator: false,
      DeliveryNoteReference: {
        actionCode: "01",
        ID: params.form.idnID,
      },
      Item: params.list.map((item) => convItem(item, params.form.deliveryDate)),
      SRM005: params.form.desc,
    },
  };
  draft.response.body = { payload, wsdlAlias, tenantID };

  let result;
  try {
    result = await soap(`manage_gsa:${wsdlAlias}`, {
      // p12ID: `p12test:${certAlias}`,
      tenantID,
      operation: "ManageGSAInMaintainBundle",
      payload,
    });
    if (result.statusCode === 200) {
      const body = JSON.parse(result.body);
      const transactionDocument =
        tryit(
          () =>
            body.GoodsAndServiceAcknowledgement[0]
              .BusinessTransactionDocumentID,
          {}
        ) || {};
      const gsaID = transactionDocument._value_1;
      if (gsaID) {
        draft.response.body.E_STATUS = "S";
        draft.response.body.E_MESSAGE = "입고 서비스 문서가\n생성되었습니다";
      } else {
        draft.response.body.E_STATUS = "F";
        draft.response.body.E_MESSAGE =
          "입고 서비스 문서\n생성 과정에서 \n문제가 발생했습니다";
      }
      draft.response.body = {
        ...draft.response.body,
        statusCode: result.statusCode,
        body,
        gsaID,
      };
    } else throw new Error("soap failed");
  } catch (error) {
    draft.response.body = {
      ...draft.response.body,
      error: error.message,
      result,
    };
  }
  if (draft.json.resultUploadKey) {
    const uploadResult = await file.upload(
      draft.json.resultUploadKey,
      draft.response.body
    );
    draft.response.body = { ...draft.response.body, uploadResult };
  }

  function convItem(item, deliveryDate) {
    return {
      actionCode: "01",
      BusinessTransactionDocumentTypeCode: "19",
      Quantity: { unitCode: item.unit, _value_1: item.deliveryQty },
      PurchaseOrderReference: {
        ActionCode: "01",
        BusinessTransactionDocumentReference: {
          ID: item.purchaseOrderID,
          TypeCode: "001",
          ItemID: item.purchaseOrderItemID,
          ItemTypeCode: "19",
        },
      },
      DeliveryPeriod: {
        StartDateTime: {
          _value_1: `${deliveryDate}T00:00:00.000Z`,
          timeZoneCode: "UTC+9",
        },
        EndDateTime: {
          _value_1: `${deliveryDate}T23:59:59.000Z`,
          timeZoneCode: "UTC+9",
        },
      },
    };
  }
};
