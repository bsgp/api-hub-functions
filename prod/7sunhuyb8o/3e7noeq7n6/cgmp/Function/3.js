module.exports = async (draft, { request, odata, fn, env }) => {
  const { resultUploadKey, ...args } = request.body || {};
  draft.json.params = { ...args };
  draft.json.cgmp_resultUploadKey = resultUploadKey;
  draft.response.body = {};

  const searchType = args && args.searchType;
  const identifiedStockIDs = args && args.identifiedStockID;

  if (searchType !== "shippingDate" && searchType !== "productionDate") {
    draft.json.nextNodeKey = "Function#4";
    draft.response.body.request = request;
    draft.response.body.E_STATUS = "F";
    draft.response.body.E_MESSAGE = "지정되지 않은\n조회 유형입니다";
    return;
  }
  const username = env.BYD_ID;
  const password = env.BYD_PASSWORD;

  /** identifiedStockIDs가 있는 경우 리포트 조회를 위해 자재코드 조회
   * (자재코드/동종재고 형태로 조회가 가능) */
  const iStockList = [];
  if (identifiedStockIDs.length > 0) {
    const filter = identifiedStockIDs
      .map((id) => `IdentifiedStockID eq '${id}'`)
      .join(" or ");

    const iStockQueryString = [
      "$select=MaterialInternalID,IdentifiedStockID",
      `$filter=(${filter})`,
      "$inlinecount=allpages",
      "$format=json",
    ].join("&");

    const url = [
      `${env.BYD_URL}/sap/byd/odata/cust/v1/`,
      "bsg_identified_stock/IdentifiedStockCollection?",
      iStockQueryString,
    ].join("");
    const iStockData = await fn.fetchAll(odata, { url, username, password });
    const searchIStock = iStockData.result;
    draft.response.body.searchIStock = searchIStock;

    let isNotValidIstock, iStock;

    identifiedStockIDs.forEach((id) => {
      const fIStock = searchIStock.find((it) => it.IdentifiedStockID === id);
      if (!fIStock) {
        isNotValidIstock = true;
        iStock = id;
      }
      return iStockList.push(`${fIStock.MaterialInternalID}/${id}`);
    });
    if (isNotValidIstock) {
      draft.json.nextNodeKey = "Function#4";
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: `동종재고 ${iStock}를\n조회할 수 없습니다`,
      };
      return;
    }
  }

  draft.json.params = {
    ...draft.json.params,
    identifiedStockID: iStockList > 0 ? iStockList : "",
  };

  const queryString = fn.getQueryParams({
    params: {
      ...draft.json.params,
      identifiedStockID: iStockList.length > 0 ? iStockList : "",
    },
    env,
  });
  const url = [
    `${env.BYD_URL}/sap/byd/odata/cc_home_analytics.svc/`,
    "RPSCMCFJU01_Q0001QueryResults?",
    Object.keys(queryString)
      .map((key) => `${key}=${queryString[key]}`)
      .join("&"),
  ].join("");

  // draft.response.body = { url, queryString };
  const cfjData = await fn.fetchAll(odata, { url, username, password });

  const confirmationJournal = cfjData.result;
  draft.json.confirmationJournal = confirmationJournal;

  draft.json.searchType = searchType;
  draft.json.nextNodeKey = "Function#5";
};
