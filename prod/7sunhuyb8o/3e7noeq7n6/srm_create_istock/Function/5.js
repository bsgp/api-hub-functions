module.exports = async (draft, { fn, dayjs, soap, env, lib }) => {
  const { tryit } = lib;
  const wsdlAlias = "dev";
  const tenantID = env.BYD_TENANT;
  const createStockIDs = draft.json.createStockIDs;

  // Client 배포 후 iStocks 제거(23.03.06)

  const iStockBundle = createStockIDs.map((item) => {
    const {
      iStockID,
      materialID,
      externalIStockID,
      iStockParty,
      productionDate,
      expirationDate,
    } = item;
    const ProductionDateTime =
      productionDate &&
      `${fn.convDate(dayjs, productionDate, "YYYY-MM-DDTHH:mm:ss", -9)}Z`;
    const ExpirationDateTime = expirationDate && `${expirationDate}T14:59:59Z`;
    return {
      actionCode: "01",
      activateIdentifiedStockIndicator: "true",
      IdentifiedStockID: iStockID,
      ExternalIdentifiedStockID: externalIStockID || undefined,
      ProductID: materialID,
      ProductionDateTime,
      ExpirationDateTime,
      SupplierID: { PartyID: iStockParty, PartyTypeCode: "147" },
      TextCollection: {
        TextListCompleteTransmissionIndicator: "true",
        ActionCode: "01",
        Text: {
          ActionCode: "01",
          TypeCode: "10011",
          TextContent: {
            ActionCode: "01",
            Text: {
              languageCode: "KO",
              _value_1: "Created By BSG SUPPORT",
            },
          },
        },
      },
    };
  });
  if (iStockBundle.length > 0) {
    const payload = {
      BasicMessageHeader: {},
      IdentifiedStockMaintainBundle: iStockBundle,
    };
    draft.response.body = { ...draft.response.body, payload };

    let result;
    try {
      result = await soap(`manage_istock:${wsdlAlias}`, {
        // p12ID: `p12test:${certAlias}`,
        tenantID,
        operation: "MaintainBundle",
        payload,
      });
      if (result.statusCode === 200) {
        const body = JSON.parse(result.body);
        const iStockResult = body.IdentifiedStockResponse || [];
        const iStockResultList = iStockResult.map((res) =>
          tryit(() => res.IdentifiedStockID._value_1, "")
        );
        if (iStockResultList.length > 0) {
          draft.response.body.E_STATUS = "S";
          draft.response.body.E_MESSAGE = "동종재고가 생성되었습니다.";
        } else {
          draft.response.body.E_STATUS = "F";
          draft.response.body.E_MESSAGE =
            "동종재고 생성 중 에러가 발생했습니다.";
        }
        draft.response.body = {
          ...draft.response.body,
          statusCode: result.statusCode,
          body,
          iStockResultList,
        };
      } else throw new Error("soap failed");
    } catch (error) {
      draft.response.body = {
        ...draft.response.body,
        error: error.message,
        result,
      };
    }
  }
};
