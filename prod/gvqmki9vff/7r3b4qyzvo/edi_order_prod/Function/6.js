module.exports = async (draft, { odata }) => {
  const isTest = draft.pipe.json.isTest;

  const orderArr = draft.pipe.json.SalesOrderArr;
  const EANs = draft.pipe.json.EAN;

  const hostname = isTest
    ? "my356725.sapbydesign.com"
    : "my357084.sapbydesign.com";
  const reportNum = "RPZ41348B656183854B13B242";
  const username = "cfo";
  const password = isTest ? "Lguklghq20221" : "Lguklghq2022";

  const checkEAN = (productID) => {
    // 존재하지 않는 EAN code 샘플 데이터 테스트용
    if (isTest) {
      if (productID === "1234567890120") {
        return "1234567890128";
        // }else if(productID == '8000000000000'){
        //     EANcode = '8000000000026';
      } else if (productID === "1234567890450") {
        return "8000000000019";
      } else return productID;
    } else return productID;
  };

  let material = [];
  for (let idx = 0; idx < EANs.length; idx = idx + 15) {
    const slice = EANs.slice(idx, idx + 15);
    const filter = slice.map((productID) => {
      return `CGTIN eq '${checkEAN(productID)}'`;
    });
    const queryStr = [
      `$select=CQUANTITY_TYPE_CODE,CGTIN,CMATR_INT_ID,TMATR_INT_ID`,
      `$filter=(${filter.join(" or ")})`,
      `$format=json`,
    ].join("&");
    const url = [
      `https://${hostname}`,
      `/sap/byd/odata/ana_businessanalytics_analytics.svc`,
      `/${reportNum}QueryResults?`,
      queryStr,
    ].join("");
    const getMaterial = await odata.get({ url, username, password });
    material = material.concat(getMaterial.d.results);
    // draft.response.body.push(url);
  }

  for (let orderIdx = 0; orderIdx < orderArr.length; orderIdx++) {
    if (!orderArr[orderIdx].isComplete) {
      continue;
    }
    for (
      let itemIdx = 0;
      itemIdx < orderArr[orderIdx].SalesOrder.Item.length;
      itemIdx++
    ) {
      const orderItem = orderArr[orderIdx].SalesOrder.Item[itemIdx];
      const itemProduct = orderItem.ItemProduct;
      const EANcode = checkEAN(itemProduct.ProductInternalID);
      const productInfo = material.find((item) => item.CGTIN === EANcode);

      if (!productInfo) {
        draft.pipe.json.isComplete[orderIdx] = false;
        orderArr[orderIdx].isComplete = false;
        orderArr[orderIdx].errorCode.push(EANcode);
        orderArr[orderIdx].errorDescription.push(
          `Unknown EANcode code: ${EANcode}`
        );
      } else {
        if (productInfo.CQUANTITY_TYPE_CODE !== "EA") {
          draft.pipe.json.ProductIDs.push(productInfo.CMATR_INT_ID);
        }
        itemProduct.ProductInternalID = productInfo.CMATR_INT_ID;
        itemProduct.UnitOfMeasure = productInfo.CQUANTITY_TYPE_CODE;
        orderItem.EXT008 = productInfo.CQUANTITY_TYPE_CODE;
      }
    }
  }

  // draft.response.body.push(orderArr);
};
