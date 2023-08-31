module.exports = async (draft, { env, tryit }) => {
  const https = require("https");
  const xml2js = require("xml2js");
  const { form, list } = draft.json.params;
  const hostname = env.BYD_URL.replace(/https:\/\//, "");
  const idNpw = `${env.BYD_ID}:${env.BYD_PASSWORD}`;
  const Authorization =
    "Basic " +
    new Buffer.alloc(Buffer.byteLength(idNpw), idNpw).toString("base64");
  const df_params = { hostname, port: 443, Authorization };
  const changed = [];
  const updateResults = [];
  for (let idx = 0; idx < list.length; idx++) {
    const { objectID, ...item } = list[idx];
    let data, method;
    if (item.isSplitItem && item.chargeDivision === "103") {
      // 유상 아이템 항목 생성
      method = "POST";
      data = JSON.stringify({
        ParentObjectID: form.objectID,
        StartDateTime: `/Date(${new Date(item.startDate).valueOf()})/`,
        Quantity: item.deliveryQty && `${item.deliveryQty}`,
        unitCode: item.unitCode,
        ProductID: item.materialID,
        ChargeDivision_KUT: "103",
        ListUnitPriceAmount: `${item.unitPrice}`,
        DirectMaterialIndicator: false,
        ThirdPartyDealIndicator: false,
        Manufacturer_KUT: item.manufacturer,
        EmployeeTimeConfirmationRequiredIndicator: false,
        GoodsAndServiceReceiptRequirementCode: "01", // ??
        EvaluatedReceiptSettlementIndicator: false,
        InvoiceRequirementCode: "01",
        AcknowledgmentRequirementCode: "04",
        PurchaseOrderShipToItemLocation: {
          LocationID: item.orderSiteID,
        },
      });
    } else {
      // 제조사 update
      method = "PATCH";
      data = JSON.stringify({ Manufacturer_KUT: item.manufacturer });
    }
    const params = { ...df_params, objectID, method, data };

    const getNPatchFnRes = await getNPatchFn(params);
    const updateResult = getNPatchFnRes.updateResult;
    const resultStautsCode = updateResult.statusCode;
    let exception = false;
    if (
      resultStautsCode === 201 ||
      (resultStautsCode === 204 && method === "POST")
    ) {
      let postResult;
      await xml2js.parseString(updateResult.body, (error, result) => {
        if (error) {
          throw new Error(error);
        } else {
          postResult = result;
        }
      });
      const newID = tryit(
        () => postResult.entry.content[0]["m:properties"][0]["d:ID"][0],
        ""
      );
      if (!newID) {
        exception = true;
      }
      changed.push({
        objectID,
        ...item,
        purchaseOrderItemID: newID,
        postResult,
      });
    } else changed.push({ objectID, ...item });
    updateResults.push({
      getNPatchFnRes,
      E_STATUS:
        (resultStautsCode === 201 || resultStautsCode === 204) && !exception
          ? "S"
          : "F",
      E_MESSAGE:
        resultStautsCode === 201 || resultStautsCode === 204
          ? "Updated Successfully"
          : ["Error occurred"].filter(Boolean).join(": "), // , errorMsg
    });
  }
  const F_Result = updateResults.find((res) => res.E_STATUS === "F");
  draft.response.body = {
    ...draft.response.body,
    E_STATUS: F_Result ? "F" : "S",
    E_MESSAGE: F_Result
      ? "구매오더 업데이트에 실패했습니다"
      : "구매오더 항목 업데이트가 완료되었습니다",
    updateResults,
    changed,
  };

  // HTTP_Request(GET, PATCH): innerFn: requestFn, getOpt
  async function getNPatchFn(params) {
    const requestFn = (opt, data) =>
      new Promise((resolve, reject) => {
        const response = { body: "" };
        const req = https.request(opt, function (res) {
          if (opt.method === "GET") {
            response.token = res.headers["x-csrf-token"];
            response.cookie = res.headers["set-cookie"];
          }
          response.statusCode = res.statusCode;
          res.on("data", (data) => (response.body += data.toString()));
          res.on("end", () => resolve(response));
          res.on("error", (err) => reject(err));
        });
        req.on("error", (err) =>
          reject(`problem with request: ${err.message}`)
        );
        if (req.method !== "GET") {
          req.write(data);
        }
        req.end();
      });

    const getOpt = ({ params = {}, isPATCH = false, isPOST = false }) => {
      const { hostname, port, Authorization, objectID } = params;
      const method = isPATCH ? "PATCH" : isPOST ? "POST" : "GET";
      const dPath = "/sap/byd/odata/cust/v1/bsg_purchaseorder/";
      const updatePath = isPATCH
        ? `ItemCollection('${objectID}')`
        : "ItemCollection?sap-language=ko";
      const path = isPATCH || isPOST ? `${dPath}${updatePath}` : dPath;
      const opt = { headers: { Authorization }, hostname, port, path, method };
      if (isPATCH || isPOST) {
        opt.headers.Cookie = params.cookie;
        opt.headers["Content-Type"] = "application/json";
        opt.headers["Content-Length"] = Buffer.byteLength(params.data);
        opt.headers["X-CSRF-Token"] = params.token;
      } else opt.headers["X-CSRF-Token"] = "Fetch";
      return opt;
    };
    // REQUEST PART
    try {
      const getResult = await requestFn(getOpt({ params }));
      const { token, cookie } = getResult;
      const isPATCH = params.method === "PATCH";
      const isPOST = params.method === "POST";
      const updateOpt = getOpt({
        params: { ...params, token, cookie },
        isPATCH,
        isPOST,
      });
      const updateResult = await requestFn(updateOpt, params.data);
      return { getResult, updateResult };
    } catch (err) {
      return { getNPatchFne: err };
    }
  }
};
