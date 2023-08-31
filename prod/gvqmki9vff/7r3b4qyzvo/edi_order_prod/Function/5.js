module.exports = async (draft, { odata }) => {
  const TargetCustomer = draft.pipe.json.targetCustomer;
  const isTest = draft.pipe.json.isTest;
  const originOrderArr = draft.pipe.json.SalesOrderArr;

  const username = "cfo";
  const password = isTest ? "Lguklghq20221" : "Lguklghq2022";
  const hostname = isTest
    ? "my356725.sapbydesign.com"
    : "my357084.sapbydesign.com";

  const reportNum = "RPZFB0E99AA3B329041AA01EF";
  const queryStr = [
    `$select=CBP_UUID,CGLN_ID`,
    `$filter=(CGLN_ID eq '#glnCode#')`,
    `$format=json`,
  ].join("&");

  const tmpurl = [
    `https://${hostname}`,
    `/sap/byd/odata/ana_businessanalytics_analytics.svc`,
    `/${reportNum}QueryResults?`,
    queryStr,
  ].join("");

  // 청구처가 TargetCustomer에 있는 값만 처리한다. gnl 코드 기준
  const orderArr = [];
  originOrderArr.forEach((order) => {
    const isTarget = TargetCustomer.includes(
      order.SalesOrder.AccountParty.PartyID
    );
    if (isTarget) {
      orderArr.push(order);
    } else {
      order.isComplete = false;
      const accountParty = order.SalesOrder.AccountParty.PartyID;
      draft.response.body.push(`isNotTarget: ${accountParty}`);
      draft.response.body.push(`tmpurl: ${tmpurl}`);
    }
  });

  if (orderArr.length > 0) {
    const glnCodes = [];
    orderArr.forEach((order) => {
      const accountParty = order.SalesOrder.AccountParty.PartyID;
      const recipient = order.SalesOrder.ProductRecipientParty.PartyID;
      glnCodes.push(accountParty, recipient);
    });
    const url = tmpurl.replace(
      /#glnCode#/g,
      glnCodes.join("' or CGLN_ID eq '")
    );
    const getCustormer = await odata.get({ url, username, password });
    const customers = getCustormer.d.results;
    const getAccountCode = (glnCode) => {
      return customers.find((party) => party.CGLN_ID === glnCode);
    };

    for (let orderIdx = 0; orderIdx < orderArr.length; orderIdx++) {
      // 청구처 조회
      const currOrder = orderArr[orderIdx].SalesOrder;
      const accountGLN = currOrder.AccountParty.PartyID;
      const accountParty = getAccountCode(accountGLN);
      if (!accountParty) {
        draft.pipe.json.isComplete[orderIdx] = false;
        orderArr[orderIdx].isComplete = false;
        orderArr[orderIdx].errorCode.push(accountGLN);
        orderArr[orderIdx].errorDescription.push(
          `Unknown GLN(Account) code: ${accountGLN}`
        );
        // TODO: setPostData(params);
      } else {
        currOrder.AccountParty.PartyID = accountParty.CBP_UUID;
        currOrder.BillToParty.PartyID = accountParty.CBP_UUID;
      }

      const receipentGLN = currOrder.ProductRecipientParty.PartyID;
      const recipientParty = getAccountCode(receipentGLN);
      if (!recipientParty) {
        draft.pipe.json.isComplete[orderIdx] = false;
        orderArr[orderIdx].isComplete = false;
        orderArr[orderIdx].errorCode.push(receipentGLN);
        orderArr[orderIdx].errorDescription.push(
          `Unknown GLN(ShipTo) code: ${receipentGLN}`
        );
        // TODO: setPostData(params);
      } else {
        currOrder.ProductRecipientParty.PartyID = recipientParty.CBP_UUID;
      }
    }
    // draft.response.body.push(orderArr);
  }
};
