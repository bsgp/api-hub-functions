module.exports = async (draft, context) => {
  try {
    const { list } = draft.json.params;
    const { env, fn, kst, dayjs, odata } = context;
    const baseURL = env.BYD_URL;
    const username = env.BYD_ID;
    const password = env.BYD_PASSWORD;

    /**
     * 동종재고 유효성 확인
     * 요청 년/월 알파벳 데이터 + ????으로 마지막 동종재고 반환
     */
    const yearMonth = fn.convDate(dayjs, kst, "YYYY-MM");
    const lastIStockParams = fn.getLastIStockParams(yearMonth);
    const iStockQueryString = Object.keys(lastIStockParams)
      .map((key) => `${key}=${lastIStockParams[key]}`)
      .join("&");

    const iStockService =
      "/sap/byd/odata/cust/v1/bsg_identified_stock/IdentifiedStockCollection?";
    const lastIStock_url = [baseURL, iStockService, iStockQueryString].join("");

    const lastIStocks = await fn
      .fetchAll(odata, { url: lastIStock_url, username, password })
      .then(({ result = [] }) => result);

    let currCount = 0;
    if (lastIStocks.length > 0) {
      const regex = new RegExp("[0-9A-F]{4}");
      const lastIStock = lastIStocks.filter((item) =>
        regex.test(item.ID.substr(2, 4))
      );
      currCount = parseInt(lastIStock[0].ID.substr(2, 4), 16) + 1;
    } else {
      currCount = 0;
    }

    const createStockIDs = [];
    for (const item of list) {
      const newLotNumber = fn.stockNumber(currCount, yearMonth);
      currCount++;
      const lotToCreate = {
        ...item,
        iStockID: newLotNumber,
      };
      createStockIDs.push(lotToCreate);
    }
    draft.json.createStockIDs = createStockIDs;
    draft.response.body = {
      // ...draft.response.body,
      list,
      lastIStock_url,
      lastIStocks,
      iStockList: createStockIDs,
    };
  } catch (error) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Error : ${error.message}`,
    };
  }
};
