module.exports = async (draft, { odata, lib, file }) => {
  const { tryit, defined } = lib;
  const username = draft.json.username;
  const password = draft.json.password;
  const url = draft.json.url;
  const params = draft.json.params;

  const filterArr = [];
  if (params.productID) {
    filterArr.push(`CMATERIAL_UUID eq '${params.productID}'`);
  }
  if (params.iStockID) {
    const iStock = [params.productID, params.iStockID].join("/");
    filterArr.push(`CISTOCK_UUID eq '${iStock}'`);
  }
  if (params.siteID) {
    if (params.lAreaID) {
      const logistics = [params.siteID, params.lAreaID].join("/");
      filterArr.push(`CLOG_AREA_UUID eq '${logistics}'`);
    } else filterArr.push(`CSITE_UUID eq '${params.siteID}'`);
  }
  const filter = filterArr.filter(Boolean).join(" and ");
  const select = [
    "CMATERIAL_UUID",
    "TMATERIAL_UUID",
    "CISTOCK_UUID",
    "TISTOCK_UUID",
    // "C1ISTOCK_UUIDsSUPPLIER_ID",
    "CLOG_AREA_UUID",
    "TLOG_AREA_UUID",
    "TSITE_UUID",
    "KCON_HAND_STOCK",
    "KCRESTRICTED_STOCK",
    "KCQUALITY_STOCK",
    "CEXP_DATE",
    "CON_HAND_STOCK_UOM",
  ].join(",");

  const queryParameters = [
    `$select=${select}`,
    filter ? `$filter=${filter}` : undefined,
    "$format=json",
    "sap-language=ko",
    "$inlinecount=allpages",
    "$top=2000",
  ];
  if (params.skip) {
    queryParameters.push(`$skip=${params.skip}`);
  }
  const queryString = queryParameters.filter(Boolean).join("&");
  const odataURL = [url, queryString].join("?");
  const odataRes = await odata.get({
    url: odataURL,
    username,
    password,
  });
  const stockData = tryit(() => defined(odataRes.d.results, []), []);

  const inlinecount = tryit(() => defined(odataRes.d.__count, 0), 0);
  const fetchcount = Number(params.skip || 0) + stockData.length;
  const isLast = fetchcount === Number(inlinecount);

  const stock = stockData.map((item) => {
    const productReg = new RegExp(`${item.CMATERIAL_UUID}/`, "g");
    const [siteID, logisticAreaID] = item.CLOG_AREA_UUID.split("/");
    const [eDate] = item.CEXP_DATE.split(" ");
    return {
      productID: item.CMATERIAL_UUID,
      productText: item.TMATERIAL_UUID,
      iStockID: item.CISTOCK_UUID.replace(productReg, ""),
      iStockText: item.TISTOCK_UUID,
      supplierID: item.C1ISTOCK_UUIDsSUPPLIER_ID,
      expireDate: [eDate].join(" "),
      restricted: !!Number(item.KCRESTRICTED_STOCK),
      inspectionStock: !!Number(item.KCQUALITY_STOCK),
      quantity: Number(item.KCON_HAND_STOCK),
      unit: item.CON_HAND_STOCK_UOM,
      siteID: item.TSITE_UUID || siteID,
      logisticAreaID,
      logisticAreaText: item.TLOG_AREA_UUID,
    };
  });
  const msgStack = [];
  if (stock.length === 0) {
    msgStack.push("검색결과가 없습니다");
  } else {
    msgStack.push("조회가 완료됐습니다");
  }
  if (!isLast) {
    msgStack.push(`더 조회할 Data가 있습니다(${fetchcount}/${inlinecount})`);
  }

  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: msgStack.join("\n"),
    isLast,
    stock,
    odataURL,
    resultUploadKey: draft.json.resultUploadKey || "not Found",
  };
  if (draft.json.resultUploadKey) {
    // const payloadString = JSON.stringify(draft.response.body);
    // const buf = Buffer.from(payloadString, "utf8").toString();
    const uploadResult = await file.upload(
      draft.json.resultUploadKey,
      draft.response.body
    );
    draft.response.body = { ...draft.response.body, uploadResult };
  }
};
