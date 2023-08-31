module.exports = async (draft, { request, env }) => {
  const params = request.body;
  const firstLetter = `${params.VENDOR}`[0];
  const VENDOR = params.VENDOR
    ? isNaN(Number(firstLetter))
      ? params.VENDOR.toUpperCase()
      : `${params.VENDOR}`.padStart(10, "0")
    : undefined;

  draft.pipe.json.VENDOR = VENDOR;
  draft.pipe.json.connection = {
    ashost: env.RFC_ASHOST,
    client: env.RFC_CLIENT,
    user: env.RFC_USER,
    passwd: env.RFC_PASSWORD,
    lang: "en",
  };
  draft.response.body = { params, conversion: [] };
  if (!params.VENDOR) {
    draft.json.nextNodeKey = "Output#2";
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "F",
      E_MESSAGE: "조회 조건이 충족되지 않았습니다.",
    };
    return;
  }
  // PO_NUMBER 혹은 Date로 조회
  draft.pipe.json.currentCount = 0;
  draft.pipe.json.PO_List = [];
  if (params.PO_NUMBER) {
    draft.json.nextNodeKey = "RFC#7";
    draft.pipe.json.PO_Count = 0;
    const payload = {
      PURCHASEORDER: `${params.PO_NUMBER}`,
      ITEMS: "X",
      SCHEDULES: "X",
      HISTORY: "X",
      ITEM_TEXTS: "X",
      HEADER_TEXTS: "X",
    };
    draft.pipe.json.PO_List.push(payload);
    draft.pipe.json.PO_Params = payload;
  } else if (params.FROM && params.TO) {
    if (!params.DATE) {
      draft.json.nextNodeKey = "Output#2";
      draft.response.body = {
        ...draft.response.body,
        E_STATUS: "F",
        E_MESSAGE: "잘못된 조회 조건입니다.",
      };
      return;
    }
    draft.json.nextNodeKey = "Loop#11";
    const DATES = `${params.DATE}`.split(",");
    draft.pipe.json.DATES = DATES;
    draft.pipe.json.PO_List_Count = DATES.length;
    draft.pipe.json.PO_List_Params = {
      DOC_DATE: DATES[0],
      VENDOR,
      WITH_PO_HEADERS: "X",
    };
    draft.response.body = { ...draft.response.body, DATES, purchaseOrders: [] };
  } else {
    draft.json.nextNodeKey = "Output#2";
    draft.response.body = {
      ...draft.response.body,
      E_STATUS: "F",
      E_MESSAGE: "조회 조건이 충족되지 않았습니다.",
    };
  }
};
