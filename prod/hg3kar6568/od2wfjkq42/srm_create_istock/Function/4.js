module.exports = async (draft, { dayjs, soap, env, lib, file }) => {
  const { tryit } = lib;
  const wsdlAlias = "dev";
  const tenantID = env.BYD_TENANT;
  const { list } = draft.json.params;

  const today = convDate(dayjs, new Date(), "YYMMDD");

  const randomKey = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Client 배포 후 iStocks 제거(23.03.06)
  const iStocks = [];
  const iStockList = [];
  const iStockBundle = list
    .filter(
      (item) =>
        item.directMaterialIndicator &&
        ["01", "02", "04"].includes(item.iStockType)
    )
    .map((item, idx) => {
      const {
        itemID,
        materialID,
        externalIStockID,
        iStockParty,
        productionDate,
        expirationDate,
      } = item;
      const idxStr = `${idx + 1}`.padStart(3, "0");
      const IdentifiedStockID = [today, `${randomKey}H${idxStr}`].join("-");
      iStocks.push(IdentifiedStockID);
      iStockList.push({ itemID, iStockID: IdentifiedStockID });
      const ProductionDateTime =
        productionDate && `${productionDate}T00:00:00Z`;
      const ExpirationDateTime =
        expirationDate && `${expirationDate}T23:59:59Z`;
      return {
        actionCode: "01",
        activateIdentifiedStockIndicator: "true",
        IdentifiedStockID,
        ExternalIdentifiedStockID: externalIStockID || undefined,
        ProductID: materialID,
        ProductionDateTime,
        ExpirationDateTime,
        SupplierID: { PartyID: iStockParty },
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
          iStockList,
          iStocks,
        };
      } else throw new Error("soap failed");
    } catch (error) {
      draft.response.body = {
        ...draft.response.body,
        error: error.message,
        result,
      };
    }
  } else {
    draft.response.body.E_STATUS = "S";
    draft.response.body.E_MESSAGE = [
      "입하통지를 생성합니다",
      "잠시만 기다려주세요",
    ].join("\n");
  }
  if (draft.json.resultUploadKey) {
    const uploadResult = await file.upload(
      draft.json.resultUploadKey,
      draft.response.body
    );
    draft.response.body = { ...draft.response.body, uploadResult };
  }
};

function convDate(dayjs, dateStr, format = "YYYY-MM-DD") {
  if (!dateStr) {
    return "";
  }
  let date;
  if (typeof dateStr === "string") {
    if (/^\d{1,}$/.test(dateStr)) {
      date = dateStr;
    } else {
      const numberString = dateStr.replace(/^\/Date\(/, "").replace(")/", "");
      if (/^\d{1,}$/.test(numberString)) {
        date = new Date(parseInt(numberString, 10));
      } else date = numberString;
    }
  }
  return dayjs(date).format(format);
}
