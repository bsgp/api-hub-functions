module.exports.fetchAll = async (odata, { url, username, password }) => {
  // url에 skip이 들어가 있으면 안됨, $top이 있어도 전체 data를 받아옴
  const getData = (skip = 0) =>
    odata.get({ url: `${url}&$skip=${skip}`, username, password });
  let junk;
  try {
    const fetchData = await getData();
    junk = fetchData;
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
    return { errorMsg: error.message, result: [], url, junk };
  }
};

const convDate = (dayjs, dateStr, format = "YYYY-MM-DD", addNum) => {
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
  if (addNum !== undefined && typeof addNum === "number") {
    return dayjs(date).add(addNum, "hour").format(format);
  }
  return dayjs(date).add(9, "hour").format(format);
};

module.exports.convDate = convDate;

module.exports.getChunks = (array = []) => {
  const chunkSize = 50;
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
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

const getPurchaseOrdersFilterParams = (params = {}) => {
  if (Object.entries(params).length === 0 && params.constructor === Object) {
    throw new Error("검색 조건이 없습니다.");
  }
  const _filter = [];
  if (params.purchaseOrderID) {
    let purchaseOrderID = "";
    if (params.purchaseOrderID.constructor === Array) {
      purchaseOrderID = params.purchaseOrderID
        .map((id) => {
          return `ID eq '${id}'`;
        })
        .join(" or ");
    } else purchaseOrderID = `ID eq '${params.purchaseOrderID}'`;

    if (purchaseOrderID) {
      _filter.push(`(${purchaseOrderID})`);
    }
  }
  return _filter.filter(Boolean);
};

module.exports.getPurchaseOrderParams = (params) => {
  const filter = getPurchaseOrdersFilterParams(params);
  return {
    "sap-language": "ko",
    $orderby: "ID desc",
    $top: "100",
    $format: "json",
    $inlinecount: "allpages",
    $filter: filter.join(" and "),
    $expand: [
      "BillToParty",
      // "SellerParty/SellerPartyDisplayName",
      "SellerParty/SellerPartyPostalAddress",
      "EmployeeResponsibleParty/EmployeeResponsiblePartyDisplayName",
      "PurchaseOrderText",
      "Item/PurchaseOrderItemText",
      // "Item/PurchaseOrderItemScheduleLine"
    ],
  };
};

module.exports.getIDN_Report_Params = (purchaseOrderIDs = []) => {
  const idn_select = [
    "CDEL_CANCELLATION_STATUS,TDEL_CANCELLATION_STATUS",
    "CPO_UUID,CPO_ITM_UUID",
    "CDEL_RELEASE_STATUS,TDEL_RELEASE_STATUS",
    "KCDEL_QTY,CDEL_QTY_UNT,TDEL_QTY_UNT",
    "KCNET_PRC_AMT,CDEL_NOTIF_STAT,TDEL_NOTIF_STAT,Cs1ANsB90CDEA3661B110",
  ];
  return {
    "sap-language": "ko",
    $format: "json",
    $inlinecount: "allpages",
    $select: idn_select.join(","),
    $filter: purchaseOrderIDs.map((po) => `(CPO_UUID eq '${po}')`).join(" or "),
  };
};
