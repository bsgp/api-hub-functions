module.exports = async (draft, { soap, env, lib, file }) => {
  const { tryit } = lib;
  const wsdlAlias = "dev";
  const tenantID = env.BYD_TENANT;
  const params = draft.json.params;
  const payload = {
    BasicMessageHeader: {},
    StandardInboundDeliveryNotification: {
      ...convIDN(params.form),
      Item: params.list.map(convItem),
    },
  };
  draft.response.body = { payload, wsdlAlias, tenantID };

  let result;
  try {
    result = await soap(`manage_standard_idn:${wsdlAlias}`, {
      // p12ID: `p12test:${certAlias}`,
      tenantID,
      operation: "MaintainBundle",
      payload,
    });
    if (result.statusCode === 200) {
      const body = JSON.parse(result.body);
      const deliveryNotificationID = tryit(
        () =>
          body.StandardInboundDeliveryNotificationConfirmationBody[0]
            .DeliveryNotificationID._value_1,
        ""
      );
      if (deliveryNotificationID) {
        draft.response.body.E_STATUS = "S";
        draft.response.body.E_MESSAGE = "입하통지가 생성되었습니다.";
      } else {
        draft.response.body.E_STATUS = "F";
        draft.response.body.E_MESSAGE =
          "입하통지 생성 과정에서 에러가 발생했습니다.";
      }
      draft.response.body = {
        ...draft.response.body,
        statusCode: result.statusCode,
        body,
        deliveryNotificationID,
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

  function convIDN(idn) {
    return {
      actionCode: "01",
      cancellationDocumentIndicator: false,
      releaseDocumentIndicator: false,
      DeliveryNotificationID: idn.idnID, // ID
      ProcessingTypeCode: "SD", // 고정값
      DeliveryDate: {
        StartDateTime: {
          _value_1: `${idn.deliveryDate}T00:00:00.000Z`,
          timeZoneCode: "UTC+9",
        },
        EndDateTime: {
          _value_1: `${idn.deliveryDate}T23:59:59.000Z`,
          timeZoneCode: "UTC+9",
        },
      },
      ShipToLocationID: idn.shipTo,
      ProductRecipientID: idn.company,
      VendorID: idn.supplier,
      TextCollection: {
        actionCode: "01",
        Text: {
          actionCode: "01",
          TypeCode: "10011",
          CreationDateTime: `${idn.creationDate}T00:00:00.000Z`,
          ContentText: { languageCode: "EN", _value_1: idn.desc },
        },
      },
    };
  }

  function convItem(item) {
    return {
      actionCode: "01",
      cancellationItemIndicator: false,
      LineItemID: item.itemID,
      TypeCode: "14",
      ProcessingTypeCode: "INST",
      DeliveryQuantity: { unitCode: item.unit, _value_1: item.deliveryQty },
      IdentifiedStockID: item.iStock,
      IdentifiedStockTypeCode: "03",
      SellerPartyID: item.supplier,
      BuyerPartyID: item.company,
      ItemProduct: { actionCode: "01", ProductID: item.materialID },
      ItemBusinessTransactionDocumentReference: {
        actionCode: "01",
        PurchaseOrder: {
          ID: item.purchaseOrderID,
          TypeCode: "001",
          ItemID: item.purchaseOrderItemID,
        },
      },
    };
  }
};
