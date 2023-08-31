module.exports = async (draft, { odata }) => {
  // const { tryit } = lib;
  const { targetLogisticsArea, username, password, reportNum, pid } =
    draft.pipe.json;

  const select = [
    "CMATERIAL_UUID",
    "CISTOCK_UUID",
    "CLOG_AREA_UUID",
    "KCON_HAND_STOCK",
    "KCUN_RESTRICTED_STOCK",
    "KCRESTRICTED_STOCK",
    "KCQUALITY_STOCK",
    "CON_HAND_STOCK_UOM",
  ].join(",");

  const areaFilter = targetLogisticsArea.map(
    (area) => `CLOG_AREA_UUID eq 'DO03/${area}'`
  );

  const queryString = [
    `$select=${select}`,
    `$filter=(${areaFilter.join(" or ")})`,
    `$format=json`,
  ].join("&");

  const inventoryReport = [
    `https://${pid}.sapbydesign.com/sap/byd/odata`,
    `/ana_businessanalytics_analytics.svc`,
    `/${reportNum}QueryResults?`,
    queryString,
  ].join("");
  const getInventory = await odata.get({
    url: inventoryReport,
    username,
    password,
  });

  const inventoryList = getInventory.d.results;
  draft.pipe.json.inventoryList = inventoryList;
  draft.response.body.inventoryList = inventoryList;
  draft.response.body.url = inventoryReport;
};
