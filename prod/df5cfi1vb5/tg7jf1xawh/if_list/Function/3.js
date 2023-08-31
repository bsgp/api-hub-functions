module.exports = async (draft, { file }) => {
  const interfaces = {
    ["IF-MM-002"]: {
      Type: "RFC",
      Name: "ZEIS_MM_02",
      PartitionKey: "ignore",
      FileKey: "WERKS",
    },
    ["IF-MM-003"]: {
      Type: "RFC",
      Name: "ZEIS_MM_03",
      PartitionKey: "ignore",
      FileKey: "WERKS",
    },
    ["IF-MM-004"]: {
      Type: "RFC",
      Name: "ZEIS_MM_04",
      PartitionKey: "ignore",
      FileKey: "P_DATE",
    },
    ["IF-CO-001"]: {
      Type: "RFC",
      Name: "ZCO_IF_AWS_001",
      PartitionKey: "SPMON",
      PartitionFormat: "yyyyMM",
      FileKey: "BUKRS",
    },
    ["IF-PP-001"]: {
      Type: "RFC",
      Name: "Z_PP_AWS_CONF_D",
      PartitionKey: "BUDAT",
      FileKey: "WERKS",
    },
    ["IF-PP-002"]: {
      Type: "RFC",
      Name: "Z_PP_AWS_CONF_M",
      PartitionKey: "SPMON",
      PartitionFormat: "yyyyMM",
      FileKey: "WERKS",
    },
    ["IF-PP-003"]: {
      Type: "RFC",
      Name: "Z_PP_AWS_ORGI",
      PartitionKey: "SPMON",
      PartitionFormat: "yyyyMM",
      FileKey: "PLWRK+PLSCN",
    },
    ["IF-SD-001"]: {
      Type: "RFC",
      Name: "ZAWS_SD_001",
      PartitionKey: "FKDAT",
      IsSapTable: false,
      FileKey: "FKDAT",
    },
    ["IF-SD-002"]: {
      Type: "RFC",
      Name: "ZAWS_SD_002",
      PartitionKey: "FKDAT",
      IsSapTable: false,
      FileKey: "FKDAT",
    },
    ["IF-SD-003"]: {
      Type: "RFC",
      Name: "ZAWS_SD_003",
      PartitionKey: "SPMON",
      PartitionFormat: "yyyyMM",
      FileKey: "SPMON",
    },
    ["IF-SD-004"]: {
      Type: "RFC",
      Name: "ZAWS_SD_004",
      PartitionKey: "SPMON",
      PartitionFormat: "yyyyMM",
      FileKey: "SPMON",
    },
    ["IF-SD-003_2"]: {
      Type: "RFC",
      Name: "ZAWS_SD_003",
      DatasetName: "ZAWS_SD_003_2",
      PartitionKey: "SPMON",
      PartitionFormat: "yyyyMM",
      FileKey: "SPMON",
    },
    ["IF-SD-005"]: {
      Type: "RFC",
      Name: "ZAWS_SD_005",
      DatasetName: "ZAWS_SD_005",
      PartitionKey: "SPMON",
      PartitionFormat: "yyyyMM",
      FileKey: "SPMON",
    },
    ["IF-SD-005_2"]: {
      Type: "RFC",
      Name: "ZAWS_SD_005",
      DatasetName: "ZAWS_SD_005_2",
      PartitionKey: "SPMON",
      PartitionFormat: "yyyyMM",
      FileKey: "SPMON",
    },
    ["IF-WISH-001"]: {
      Type: "DB",
      Name: "VW_IF_MOC",
      PartitionKey: "CHK_DATE",
      PartitionFormat: "yyyy-MM-dd",
      FileKey: "WORK_TYPE",
    },
    ["IF-WISH-002"]: {
      Type: "DB",
      Name: "VW_IF_MOC",
      DatasetName: "VW_IF_MOC_2",
      PartitionKey: "CHK_DATE",
      PartitionFormat: "yyyy-MM-dd",
      FileKey: "WORK_TYPE",
    },
    ["IF-EHR-001"]: {
      Type: "DB",
      Name: "IV_PSNL_WORK_TIME",
      PartitionKey: "YMD",
      PartitionFormat: "yyyy-MM-dd",
      FileKey: "YMD",
    },
    ["IF-EHR-002"]: {
      Type: "DB",
      Name: "IV_CARD_PSNL_INFO",
      PartitionKey: "ignore",
      FileKey: "ENTER_CD",
    },
    ["IF-EHR-003"]: {
      Type: "DB",
      Name: "IV_HOURLY_WORK_CNT",
      PartitionKey: "YMD",
      PartitionFormat: "yyyy-MM-dd",
      FileKey: "YMD",
    },
    ["IF-EHR-004"]: {
      Type: "DB",
      Name: "VIEW_WORK_TIME",
      PartitionKey: "YMD",
      PartitionFormat: "yyyy-MM-dd",
      FileKey: "YMD",
    },
    ["IF-ENMS-001"]: {
      Type: "DB",
      Name: "ITFC_DATA_DAY_VIEW",
      PartitionKey: "YY+MM+DD",
      FileKey: "YY",
    },
    ["IF-SECOM-001"]: {
      Type: "DB",
      Name: "VIEW_SECOM_1",
      PartitionKey: "ignore",
      FileKey: "Company",
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
