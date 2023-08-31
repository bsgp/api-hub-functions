module.exports = async (draft, { file }) => {
  const interfaces = {
    ["IF-SD-020"]: {
      Type: "RFC",
      Name: "ZSD_IF_020",
      PartitionKey: "YYYY+MM",
      PartitionFormat: "yyyyMM",
      FileKey: "YYYY",
    },
    ["IF-FI-007"]: {
      Type: "RFC",
      Name: "ZFI_IF_007",
      PartitionKey: "YEAR+MONTH",
      PartitionFormat: "yyyyMM",
      FileKey: "YEAR",
    },
    ["IF-CO-007"]: {
      Type: "RFC",
      Name: "ZCO_IF_007",
      PartitionKey: "YYYY+MM",
      PartitionFormat: "yyyyMM",
      FileKey: "YYYY",
    },
    ["IF-CO-008"]: {
      Type: "RFC",
      Name: "ZCO_IF_008",
      PartitionKey: "YYYY+MM",
      PartitionFormat: "yyyyMM",
      FileKey: "YYYY",
    },
    ["IF-MM-011"]: {
      Type: "RFC",
      Name: "ZMM_IF_011",
      PartitionKey: "YYYY+MM+DD",
      PartitionFormat: "yyyyMMdd",
      FileKey: "YYYY",
    },
    ["IF-PP-002"]: {
      Type: "RFC",
      Name: "ZPP_IF_002",
      PartitionKey: "YYYY+MM",
      PartitionFormat: "yyyyMM",
      FileKey: "YYYY",
    },
    ["IF-GHR-001"]: {
      Type: "DB",
      Name: "JTM_DASHBOARD_EMP",
      PartitionKey: "SYSDATE_ORIGIN",
      PartitionFormat: "yyyyMMdd",
      FileKey: "SYSDATE_ORIGIN",
    },
    ["IF-GHR-002"]: {
      Type: "DB",
      Name: "JTM_DASHBOARD_COST",
      PartitionKey: "PAYYM",
      PartitionFormat: "yyyyMM",
      FileKey: "PAYYM",
    },
    ["IF-GHR-003"]: {
      Type: "DB",
      Name: "JTM_DASHBOARD_OVER_AMOUNT",
      PartitionKey: "PAYYM",
      PartitionFormat: "yyyyMM",
      FileKey: "PAYYM",
    },
    ["IF-GHR-004"]: {
      Type: "DB",
      Name: "JTM_DASHBOARD_OVER_TIME",
      PartitionKey: "PAYYM",
      PartitionFormat: "yyyyMM",
      FileKey: "PAYYM",
    },
  };

  await file.upload("if/list.json", interfaces, {
    gzip: true,
    ignoreEfs: true,
  });
  const url = await file.getUrl("if/list.json");

  draft.response.body = {
    url,
    count: Object.keys(interfaces).length,
    list: interfaces,
  };
};
