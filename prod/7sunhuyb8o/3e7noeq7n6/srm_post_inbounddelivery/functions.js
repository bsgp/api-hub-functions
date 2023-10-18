module.exports.fetchAll = async (odata, { url, username, password }) => {
  // url에 skip이 들어가 있으면 안됨, $top이 있어도 전체 data를 받아옴
  const getData = (skip = 0) =>
    odata.get({ url: `${url}&$skip=${skip}`, username, password });
  try {
    const fetchData = await getData();
    if (Number(fetchData.d.__count) === fetchData.d.results.length) {
      return { result: fetchData.d.results };
    } else {
      const data = fetchData.d.results;
      while (data.length < Number(fetchData.d.__count)) {
        const reFetchData = await getData(data.length);
        data.push(...reFetchData.d.results);
      }
      return { result: data };
    }
  } catch (error) {
    return { errorMsg: error.message, result: [], url };
  }
};

const convDate = (dayjs, dateStr, format = "YYYY-MM-DD") => {
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
  return dayjs(date).add(9, "hour").format(format);
};

module.exports.convDate = convDate;

module.exports.getCreateIDN_Params = ({ newIDN, form, list }) => {
  return {
    BasicMessageHeader: {},
    StandardInboundDeliveryNotification: {
      actionCode: "01",
      cancellationDocumentIndicator: "false",
      releaseDocumentIndicator: "false",
      DeliveryNotificationID: newIDN,
      ProcessingTypeCode: "SD",
      DeliveryDate: {
        StartDateTime: {
          timeZoneCode: "UTC+9",
          _value_1: `${form.deliveryDate}T00:00:00Z`,
        },
        EndDateTime: {
          timeZoneCode: "UTC+9",
          _value_1: `${form.deliveryDate}T00:00:00Z`,
        },
      },
      ShipToLocationID: form.shipTo,
      ProductRecipientID: form.company,
      VendorID: form.supplier,
      Item: list.map((value) => {
        return {
          actionCode: "01",
          IdentifiedStockID: value.iStockID,
          cancellationItemIndicator: "false",
          LineItemID: value.itemID,
          TypeCode: "14",
          ProcessingTypeCode: "INST",
          DeliveryQuantity: {
            unitCode: value.unitCode,
            _value_1: `${value.deliveryQty}`,
          },
          SellerPartyID: value.supplier,
          BuyerPartyID: form.company,
          ItemProduct: { actionCode: "01", ProductID: value.materialID },
          ItemBusinessTransactionDocumentReference: {
            actionCode: "01",
            PurchaseOrder: {
              ID: value.purchaseOrderID,
              TypeCode: "001",
              ItemID: value.purchaseOrderItemID,
            },
          },
          FULL_NAME: value.materialText,
        };
      }),
      TextCollection: {
        actionCode: "01",
        Text: {
          actionCode: "01",
          TypeCode: "10015",
          ContentText: { languageCode: "EN", _value_1: form.desc },
        },
      },
      Driver: form.contactText,
      DriverTelNo: form.contactPhone,
    },
  };
};
