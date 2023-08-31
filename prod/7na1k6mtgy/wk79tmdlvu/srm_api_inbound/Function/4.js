module.exports = async (draft, { env, file, odata }) => {
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  const username = draft.json.username;
  const password = draft.json.password;
  const { odataURL, params, resultUploadKey } = draft.json;

  const { searchType, skip } = params;
  const { idnID, purchaseOrderID, supplierID } = params;
  const from = params.creationDateFrom;
  const to = params.creationDateTo;
  // Check valid
  if (searchType === "detail" && !idnID) {
    const fileData = {
      ...draft.response.body,
      E_STATUS: "S",
      E_MESSAGE: "Invalid request: 납품번호를 입력해주세요",
    };
    if (resultUploadKey) {
      const uploadResult = await file.upload(resultUploadKey, fileData);
      draft.response.body = { ...draft.response.body, uploadResult };
      draft.json.nextNodeKey = "Output#2";
    } else draft.response.body = fileData;
    return;
  }
  // 입하통지, 입고서비스 수령 문서 조회
  // 발주번호로 조회하려면 collection이 다름
  // 발주번호만 있는 경우 해당 collection 사용 아닌 경우 조회 후 filtering
  const IDN_SERVICE_URL = [odataURL, "bsg_inbound_notify/"].join("");
  const GSA_SERVICE_URL = [odataURL, "bsg_gsa/"].join("");
  let IDN_Collection;
  let GSA_Collection = "ReferenceCollection?";

  const queryParams = { $inlinecount: "allpages", $format: "json" };
  const IDN_Params = Object.assign(
    {
      $expand: [
        "InboundDelivery/VendorParty/VendorAddress",
        "InboundDelivery/ShipTo/ShipToAddress/ShipToPostal",
        "InboundDelivery/RecipientParty",
        "InboundDelivery/Item/Material",
        "InboundDelivery/Item/DeliveryQuantity",
        "InboundDelivery/Item/ItemDocPO",
        "InboundDelivery/Item/IStock/IStockPartyAddress",
        "InboundDelivery/ArrivalPeriod",
        "InboundDelivery/IDNText",
      ], // toString at the end: .join("")
      $filter: [], // toString at the end: .join(" and ")
      $top: 100,
      $skip: skip,
    },
    queryParams
  );
  const GSA_Params = Object.assign(
    {
      $expand: [
        "GSA/Reference",
        "GSA/Party/PartyAddress",
        "GSA/Item/PurchaseOrderItemReference",
        "GSA/Item/Location/LocationAddress/FormattedAddress",
      ], // toString at the end: .join("")
      $filter: [], // toString at the end: .join(" and ")
      $top: 100,
      $skip: skip,
    },
    queryParams
  );
  if (purchaseOrderID && !idnID && !from && !to) {
    IDN_Collection = "ItemDocPOCollection?";
    const filterStr = `ID eq '${purchaseOrderID}' and TypeCode eq '001'`;
    IDN_Params.$filter.push(filterStr);
    GSA_Params.$filter.push(filterStr);
  } else {
    IDN_Collection = "InboundDeliveryCollection?";
    if (from && to) {
      GSA_Collection = "GSACollection?";
      IDN_Params.$filter.push(
        `CreationDateTime ge datetimeoffset'${from}T00:00:00Z'`,
        `CreationDateTime le datetimeoffset'${to}T23:59:59Z'`
      );
      GSA_Params.$filter.push(
        `GSA/CreationDateTime ge datetimeoffset'${from}T00:00:00Z'`,
        `GSA/CreationDateTime le datetimeoffset'${to}T23:59:59Z'`
      );
    }
    if (idnID) {
      IDN_Params.$filter.push(`ID eq '${idnID}'`);
      GSA_Params.$filter.push(`ID eq '${idnID}' and TypeCode eq '73'`);
    }
    if (supplierID) {
      const idnSpStr = `VendorParty/PartyID eq '${supplierID.toUpperCase()}'`;
      IDN_Params.$filter.push(idnSpStr);
      const gsaSpStr = `GSA/PartyID eq '${supplierID.toUpperCase()}'`;
      GSA_Params.$filter.push(gsaSpStr);
    }
  }
  if (IDN_Collection === "InboundDeliveryCollection?") {
    const fixIDN = (array = []) =>
      array.map((it) => it.replace(/^InboundDelivery\//, ""));
    Object.assign(IDN_Params, {
      $expand: fixIDN(IDN_Params.$expand),
      $filter: fixIDN(IDN_Params.$filter),
    });
  }
  if (GSA_Collection === "GSACollection?") {
    const fixGSA = (array = []) => array.map((it) => it.replace(/^GSA\//, ""));
    Object.assign(GSA_Params, {
      $expand: fixGSA(GSA_Params.$expand),
      $filter: fixGSA(GSA_Params.$filter),
    });
  }

  const IDN_URL = IDN_SERVICE_URL.concat(
    IDN_Collection,
    paramsToQueryString(IDN_Params)
  );
  const GSA_URL = GSA_SERVICE_URL.concat(
    GSA_Collection,
    paramsToQueryString(GSA_Params)
  );
  draft.response.body.IDN_URL = IDN_URL;
  draft.response.body.GSA_URL = GSA_URL;
  draft.json.IDN_Collection = IDN_Collection;
  draft.json.GSA_Collection = GSA_Collection;

  let IDN_DATA, GSA_DATA;
  try {
    IDN_DATA = await odata.get({ url: IDN_URL, username, password });
    GSA_DATA = await odata.get({ url: GSA_URL, username, password });

    if (
      IDN_DATA.ResponseError ||
      IDN_DATA.Exception ||
      GSA_DATA.ResponseError ||
      GSA_DATA.Exception
    ) {
      draft.response.body = {
        ...draft.response.body,
        E_STATUS: "S",
        E_MESSAGE: "Query failed, Exception Occurred",
        IDN_DATA,
        GSA_DATA,
      };
      draft.json.nextNodeKey = "Output#2";
      if (resultUploadKey) {
        await file.upload(resultUploadKey, draft.response.body);
      }
    } else {
      const IDN_COUNT = Number(IDN_DATA.d.__count || 0);
      const GSA_COUNT = Number(GSA_DATA.d.__count || 0);
      const IDN_RESULT = IDN_DATA.d.results || [];
      const GSA_RESULT = GSA_DATA.d.results || [];

      draft.json.IDN_RESULT = IDN_RESULT;
      draft.json.GSA_RESULT = GSA_RESULT;
      draft.response.body = {
        ...draft.response.body,
        IDN_COUNT,
        GSA_COUNT,
        IDN_RESULT,
        GSA_RESULT,
        isLast:
          IDN_COUNT <= IDN_RESULT.length + (skip || 0) &&
          GSA_COUNT <= GSA_RESULT.length + (skip || 0),
        skipCount: 100 + (skip || 0), // $top+ skip
      };
      draft.json.nextNodeKey = "Function#5";
    }
  } catch (error) {
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "S",
      E_MESSAGE: "Query failed, Catch Response",
      IDN_DATA,
      GSA_DATA,
    };
    draft.json.nextNodeKey = "Output#2";
    if (resultUploadKey) {
      await file.upload(resultUploadKey, draft.response.body);
    }
  }
};

const paramsToQueryString = (obj = {}) =>
  Object.keys(obj)
    .map((key) => {
      if (key === "$expand" && obj[key].length > 0) {
        return `${key}=${obj[key].join(",")}`;
      } else if (key === "$filter" && obj[key].length > 0) {
        return `${key}=${obj[key].join(" and ")}`;
      } else if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        obj[key]
      ) {
        return `${key}=${obj[key]}`;
      } else return ""; // not exist
    })
    .filter(Boolean)
    .join("&");
