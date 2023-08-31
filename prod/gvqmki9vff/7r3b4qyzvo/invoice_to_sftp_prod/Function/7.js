// get GLN, Material, SO, OD
module.exports = async (draft, { soap, odata }) => {
  const isTest = draft.pipe.json.isTest;
  const isExist = draft.pipe.json.isExist;
  const CBP_UUIDs = draft.pipe.json.CBP_UUIDs;
  const materialIDs = draft.pipe.json.materialIDs;
  const salesOrders = draft.pipe.json.salesOrders;
  const outboundDeliverys = draft.pipe.json.outboundDeliverys;

  const username = "cfo";
  const password = isTest ? "Lguklghq20221" : "Lguklghq2022";
  const reportNum = "RPZFB0E99AA3B329041AA01EF";
  const pid = isTest ? "my356725" : "my357084";
  const certAlias = isTest ? "test6" : "prod2";
  const MaterialwsdlAlias = isTest ? "test4" : "prod2";
  const tenantID = isTest ? "my356725" : "my357084";

  if (!isExist) {
    return;
  }

  let customer = [],
    material = [],
    soData = { d: { results: [] } },
    odData = { d: { results: [] } };

  for (let idx = 0; idx < CBP_UUIDs.length; idx = idx + 15) {
    const slice = CBP_UUIDs.slice(idx, idx + 15);
    const filter = slice.map((CBP_UUID) => `CBP_UUID eq '${CBP_UUID}'`);
    const select = ["CBP_UUID", "CGLN_ID"].join(",");
    const queryString = [
      `$select=${select}`,
      `$filter=(${filter.join(" or ")})`,
      `$format=json`,
    ].join("&");

    const customerReport = [
      `https://${pid}.sapbydesign.com/sap/byd/odata`,
      `/ana_businessanalytics_analytics.svc/${reportNum}QueryResults?`,
      queryString,
    ].join("");
    const getCustomer = await odata.get({
      url: customerReport,
      username,
      password,
    });
    customer = customer.concat(getCustomer.d.results);
  }

  for (let idx = 0; idx < materialIDs.length; idx = idx + 15) {
    const slice = materialIDs.slice(idx, idx + 15);
    const getMatrial = await soap(`querymaterials:${MaterialwsdlAlias}`, {
      p12ID: `lghhuktest:${certAlias}`,
      tenantID,
      operation: "FindByElements",
      payload: {
        MaterialSelectionByElements: {
          SelectionByInternalID: slice.map((id) => {
            return {
              InclusionExclusionCode: "I",
              IntervalBoundaryTypeCode: "1",
              LowerBoundaryInternalID: id,
            };
          }),
        },
      },
    });
    const materialInfo =
      getMatrial.statusCode === 200 ? JSON.parse(getMatrial.body) : {};
    material = material.concat(materialInfo.Material);
  }

  if (salesOrders.length > 0) {
    const soURL = [
      `https://${pid}.sapbydesign.com/sap/byd/odata/cust/v1/`,
      "bsg_so/SalesOrderCollection?",
      "$format=json&$filter=",
      salesOrders.map((id) => `ID eq '${id}'`).join(" or "),
    ].join("");
    soData = await odata.get({ url: soURL, username, password });
  }

  if (outboundDeliverys.length > 0) {
    const odURL = [
      `https://${pid}.sapbydesign.com/sap/byd/odata/cust/v1/`,
      "bsg_od/OutboundDeliveryCollection?",
      "$expand=Date&$format=json&$filter=",
      outboundDeliverys.map((id) => `ID eq '${id}'`).join(" or "),
    ].join("");
    odData = await odata.get({ url: odURL, username, password });
  }

  draft.pipe.json.customer = customer;
  draft.pipe.json.material = material;
  draft.pipe.json.soData = soData;
  draft.pipe.json.odData = odData;
};
