module.exports.fetchAll = async (odata, { url, username, password }) => {
  // url에 skip이 들어가 있으면 안됨, $top이 있어도 전체 data를 받아옴
  const getData = (skip = 0) =>
    odata.get({ url: `${url}&$skip=${skip}`, username, password });
  let fetchData;
  try {
    fetchData = await getData();
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
    return { errorMsg: error.message, result: [], url, fetchData };
  }
};

module.exports.getChunks = (array = []) => {
  const chunkSize = 50;
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
};

const convDate = (dayjs, dateStr, format = "YYYY-MM-DD", hour = 0) => {
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
  return dayjs(date).add(hour, "hour").format(format);
};

module.exports.convDate = convDate;

const getPO_ItemFilterParams = (params = {}, dayjs) => {
  if (Object.entries(params).length === 0 && params.constructor === Object) {
    throw new Error("검색 조건이 없습니다.");
  }

  const _filter = [
    params.confirmIndicatior === "true" ? `PO/POCONFIRM_KUT eq '102'` : ``,
    params.confirmIndicatior === "false" ? `PO/POCONFIRM_KUT eq '101'` : ``,
    (() => {
      const ds = parseInt(params.deliveryStatus);
      if (params.deliveryStatus) {
        if (ds === 1 || ds === 2) {
          return [
            `((PurchaseOrderDeliveryStatusCode eq '1')`,
            "or",
            `(PurchaseOrderDeliveryStatusCode eq '2'))`,
          ].join(" ");
        } else {
          return `PurchaseOrderDeliveryStatusCode eq '${ds}'`;
        }
      } else {
        return "";
      }
    })(),
    params.startDateFrom && params.startDateTo
      ? `(StartDateTime ge datetimeoffset'${convDate(
          dayjs,
          params.startDateFrom,
          "YYYY-MM-DDTHH:mm:ss.SSS",
          -9
        )}Z' and StartDateTime le datetimeoffset'${convDate(
          dayjs,
          params.startDateTo,
          "YYYY-MM-DDT23:59:59",
          -9
        )}Z')`
      : ``,
    params.orderDateFrom && params.orderDateTo
      ? `(PO/CreationDate ge datetimeoffset'${convDate(
          dayjs,
          params.orderDateFrom,
          "YYYY-MM-DDTHH:mm:ss.SSS",
          -9
        )}Z' and PO/CreationDate le datetimeoffset'${convDate(
          dayjs,
          params.orderDateTo,
          "YYYY-MM-DDT23:59:59",
          -9
        )}Z')`
      : ``,
    params.supplierID
      ? `(PO/SellerPartyID eq '${params.supplierID.toUpperCase()}')`
      : "",
    [
      "(PurchaseOrderDeliveryStatusCode eq '1'",
      "PurchaseOrderDeliveryStatusCode eq '2')",
    ].join(" or "),
  ];

  if (params.purchaseOrderID) {
    let purchaseOrderID = "";
    if (params.purchaseOrderID.length <= 10) {
      if (params.purchaseOrderID.constructor === Array) {
        purchaseOrderID = params.purchaseOrderID
          .map((id) => {
            return `ID eq '${id}'`;
          })
          .join(" or ");
      } else purchaseOrderID = `ID eq '${params.purchaseOrderID}'`;
    }
    if (purchaseOrderID) {
      _filter.push(`(${purchaseOrderID})`);
    }
  }
  return _filter.filter(Boolean);
};

module.exports.getPO_ItemParams = (params, dayjs) => {
  const filter = getPO_ItemFilterParams(params, dayjs);
  return {
    "sap-language": "ko",
    // $orderby: "ID desc",
    $top: "500",
    $format: "json",
    $inlinecount: "allpages",
    $filter: filter.join(" and "),
    $expand: [
      "PO/BillToParty/BillToPartyDisplayName",
      "PO/BillToParty/BillToPartyPostalAddress",
      "PO/EmployeeResponsibleParty/EmployeeResponsiblePartyDisplayName",
      "PO/SellerParty/SellerPartyDisplayName",
      "PO/SellerParty/SellerPartyPostalAddress",
      "PO/PurchaseOrderText",
      "PurchaseOrderItemScheduleLine",
      "PurchaseOrderItemText",
      "PurchaseOrderShipToItemLocation/AddressSnapshotPostalAddress",
    ],
  };
};

const getIDN_FilterParams = (params, dayjs) => {
  const _filter = [
    "ItemPurchaseOrderReference/TypeCode eq '001'",
    "InboundDelivery/CancellationStatusCode ne '4'",
    (() => {
      if (params.creationDateFrom && params.creationDateTo) {
        const conversionFn = (date) =>
          convDate(dayjs, date, `YYYY-MM-DDTHH:mm:ss[Z]`, -9);
        const sDateTime = conversionFn(`${params.creationDateFrom}T00:00:00Z`);
        const eDateTime = conversionFn(`${params.creationDateTo}T23:59:59Z`);
        return [
          `(InboundDelivery/CreationDateTime ge datetimeoffset'${sDateTime}'`,
          `InboundDelivery/CreationDateTime le datetimeoffset'${eDateTime}')`,
        ].join(" and ");
      } else return "";
    })(),
    (() => {
      if (params.idnID) {
        const filterIDs = params.idnID
          .replace(/ /g, "")
          .split(",")
          .map((idnID) => `InboundDelivery/ID eq '${idnID}'`)
          .join(" or ");
        return `(${filterIDs})`;
      } else return "";
    })(),
    (() => {
      if (params.purchaseOrderID) {
        const filterIDs = params.purchaseOrderID
          .replace(/ /g, "")
          .split(",")
          .map(
            (purchaseOrderID) =>
              `ItemPurchaseOrderReference/ID eq '${purchaseOrderID}'`
          )
          .join(" or ");
        return `(${filterIDs})`;
      } else return "";
    })(),
    (() => {
      if (params.supplierID) {
        return params.supplierID
          .replace(/ /g, "")
          .toUpperCase()
          .split(",")
          .map((supplierID) => `ItemSellerParty/PartyID eq '${supplierID}'`)
          .join(" or ");
      } else return "";
    })(),
  ];

  return _filter.filter(Boolean);
};

module.exports.getIDN_Params = (params, dayjs) => {
  const filter = getIDN_FilterParams(params, dayjs);
  return {
    "sap-language": "ko",
    $top: "1000",
    $format: "json",
    $inlinecount: "allpages",
    $filter: `(${filter.join(") and (")})`,
    $expand: [
      "InboundDelivery/InboundDeliveryArrivalPeriod",
      [
        "InboundDelivery/InboundDeliveryShipToLocation/LocationLocation",
        "ShipToLocationAddressSnapshot/ShipToLocationPostalAddress",
      ].join("/"),
      "InboundDelivery/InboundDeliveryText",
      "ItemSellerParty/SellerPartyDisplayName",
      "InboundDeliveryDeliveryQuantity",
      "ItemPurchaseOrderReference",
    ],
  };
};
