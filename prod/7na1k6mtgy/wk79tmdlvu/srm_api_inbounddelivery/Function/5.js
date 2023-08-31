module.exports = async (draft, { dayjs }) => {
  const { params, idnResult } = draft.json;
  const searchType = params.searchType;

  const conversion = [];
  idnResult.forEach((data) => {
    if (searchType === "header") {
      return data.Item.forEach((idnItem) =>
        conversion.push({
          ...headerConvFn(data),
          ...itemConvFn(idnItem),
          ...poConvFn(idnItem.ItemDocPO),
        })
      );
    }
    if (searchType === "detail") {
      return conversion.push({
        form: {
          ...headerConvFn(data),
          po: data.Item.map((item) => ({ ...poConvFn(item.ItemDocPO) })),
        },
        list: data.Item.map((idnItem, idx) => ({
          ...itemConvFn(idnItem),
          ...poConvFn(idnItem.ItemDocPO),
          index: idx + 1,
        })),
      });
    }
    if (searchType === "item") {
      return conversion.push({
        ...headerConvFn(data.InboundDelivery),
        ...itemConvFn(data),
        ...poConvFn(data.ItemDocPO),
      });
    }
    if (searchType === "itemDocPO") {
      return conversion.push({
        ...headerConvFn(data.InboundDelivery),
        ...itemConvFn(data.Item),
        ...poConvFn(data),
      });
    }
  });

  draft.response.body.conversion = conversion.map((data, idx) => ({
    index: idx + 1,
    ...data,
  }));
  draft.response.body.E_STATUS = "S";
  draft.response.body.E_MESSAGE = "조회가 완료되었습니다.";

  function headerConvFn(hd) {
    const shipToData = hd.ShipTo || {};
    const shipToAddress = shipToData.ShipToAddress || {};
    const vendorData = hd.VendorParty || {};
    const vendorAddress = vendorData.VendorAddress || {};
    const arrivalPeriod = hd.ArrivalPeriod || {};
    const recipient = hd.RecipientParty || {};
    const textCollection = Array.isArray(hd.IDNText) ? hd.IDNText : [];
    return {
      objectID: hd.ObjectID,
      idnID: hd.ID,
      creationDate: convDate(dayjs, hd.CreationDateTime),
      status: {
        release: { id: hd.ReleaseStatusCode, text: hd.ReleaseStatusCodeText },
        deliveryProcessing: {
          id: hd.DeliveryProcessingStatusCode,
          text: hd.DeliveryProcessingStatusCodeText,
        },
        cancellation: {
          id: hd.CancellationStatusCode,
          text: hd.CancellationStatusCodeText,
        },
      },
      type: {
        processing: {
          id: hd.ProcessingTypeCode,
          text: hd.ProcessingTypeCodeText,
        },
      },
      processingType: hd.ProcessingTypeCodeText,
      shipTo: shipToData.LocationID,
      shipToText: shipToAddress.FormattedName,
      shipToLocation: {
        id: shipToData.LocationID,
        text: shipToAddress.FormattedName,
      },
      supplier: vendorData.PartyID,
      supplierText: vendorAddress.FormattedName,
      recipient: recipient.PartyID,
      deliveryDate: convDate(dayjs, arrivalPeriod.StartDateTime),
      desc: textCollection
        .filter((txt) => txt.TypeCode === "10011")
        .map((txt) => txt.Text)
        .join(" "),
    };
  }
  function itemConvFn(it) {
    const materialData = it.Material || {};
    const iStockData = it.IStock || {};
    const iStockPartyAddress = iStockData.IStockPartyAddress || {};
    const deliveryQtyData = it.DeliveryQuantity || {};
    return {
      itemID: it.ID,
      materialID: it.ProductID,
      materialText: materialData.Description,
      iStockID: it.IdentifiedStockID,
      iStockType: {
        id: iStockData.IdentifiedStockTypeCode,
        text: iStockData.IdentifiedStockTypeCodeText,
      },
      iStockParty: iStockData.IStockPartyID,
      iStockPartyText: iStockPartyAddress.FormattedName,
      externalIStockID: iStockData.ExternalIStockID,
      productionDate: convDate(dayjs, iStockData.ProductionDateTime),
      expirationDate: convDate(dayjs, iStockData.ExpirationDateTime),
      deliveryQty: Number(deliveryQtyData.Quantity),
      unit: deliveryQtyData.unitCode,
    };
  }
  function poConvFn(po) {
    return {
      purchaseOrderID: po.ID,
      purchaseOrderItemID: po.ItemID,
    };
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
