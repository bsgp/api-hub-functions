module.exports = async (draft, { fn, dayjs, env, odata, user }) => {
  try {
    const { BYD_URL, BYD_ID, BYD_PASSWORD } = env;
    const params = draft.json.params;
    const queryStringObj = fn.getPurchaseOrderParams(params, dayjs);
    // draft.response.body.queryStringObj = queryStringObj;

    const queryString = Object.keys(queryStringObj)
      .map((key) => `${key}=${queryStringObj[key]}`)
      .join("&");

    const service = [
      "/sap/byd/odata/cust/v1",
      "bsg_purchaseorder/POCollection?",
    ].join("/");
    const url = [BYD_URL, service, queryString].join("");

    const queryPurchaseOrders = await fn
      .fetchAll(odata, { url, username: BYD_ID, password: BYD_PASSWORD })
      .then((res) => res.result || []);

    draft.response.body.url = url;
    // draft.response.body.queryPurchaseOrders = queryPurchaseOrders;
    draft.response.body.purchaseOrders = queryPurchaseOrders
      .filter((po) => {
        const userID = `${user.id}`;
        return (
          !params.isSupplier ||
          (params.isSupplier && po.SellerParty.PartyID === userID.toUpperCase())
        );
      })
      .map((po) => ({
        purchaseOrderID: po.ID, // 발주번호
        orderStatus: po.PurchaseOrderLifeCycleStatusCode, // 발주현황
        orderStatusText: po.PurchaseOrderLifeCycleStatusCodeText, // 발주현황
        confirmIndicatior: po.POCONFIRM_KUT === "102",
        confirmStatus: po.POCONFIRM_KUT,
        confirmStatusText: po.POCONFIRM_KUTText,
        confirmDate: fn.convDate(
          dayjs,
          po.CONFIRMDATE_KUT,
          "YYYY-MM-DD HH:mm",
          9
        ),
        deliveryStatusText: po.PurchaseOrderDeliveryStatusCodeText, // 납품상태
        deliveryStatus: po.PurchaseOrderDeliveryStatusCode, // 납품상태코드
        created: fn.convDate(dayjs, po.CreationDate, "YYYY-MM-DD HH:mm:ss", 9),
        orderDate: fn.convDate(dayjs, po.CreationDate, "YYYY-MM-DD HH:mm", 9),
        contactText: po.EmployeeResponsibleParty.FormattedName, // 구매담당자
        recipient: po.BillToParty.FormattedName, // 납품처
        supplierText: po.SellerParty.FormattedName, // 공급처
        supplierID: po.SellerParty.PartyID,
        supplierAmount: po.TotalNetAmount, // 공급가액
        taxAmount: po.TotalTaxAmount, // 부가세
        totalAmount: po.GrossAmount, // 합계금액
        desc: (
          (po.PurchaseOrderText.length > 0 && po.PurchaseOrderText[0]) ||
          {}
        ).Text, // 비고
        textButton: po.PurchaseOrderText.length > 0,
        currencyCode: po.currencyCode,
      }))
      .sort((al, be) => new Date(be.created) - new Date(al.created))
      .map((item, idx) => ({ index: idx + 1, ...item }));
  } catch (error) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: ["Error Occurred", error.message].join(": "),
      user,
    };
  }
};
