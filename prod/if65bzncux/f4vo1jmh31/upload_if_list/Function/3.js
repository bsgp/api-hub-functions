module.exports = async (draft, { file, env }) => {
  const interfaces = {
    ["IF-CO-001"]: {
      Type: "RFC",
      Name: "ZCO_IF_CCTR_MASTER_ALL",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-CO-002"]: {
      Type: "RFC",
      Name: "ZCO_IF_CCTR_LIST",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-CO-003"]: {
      Type: "RFC",
      Name: "ZCO_IF_CCTR_LIST",
      TriggeredBy: "CONTRACT",
      Path: "/rfc_contract",
    },
    ["IF-CO-004"]: {
      Type: "RFC",
      Name: "ZCO_IF_ORDER_LIST",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-CO-005"]: {
      Type: "RFC",
      Name: "ZCO_IF_WBS_LIST",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-CO-006"]: {
      Type: "RFC",
      Name: "ZCO_IF_WBS_LIST",
      TriggeredBy: "WORKSHEET",
      Path: "/rfc",
    },
    ["IF-CO-007"]: {
      Type: "RFC",
      Name: "ZCO_IF_WBS_LIST",
      TriggeredBy: "CONTRACT",
      Path: "/rfc_contract",
    },
    ["IF-CO-009"]: {
      Type: "RFC",
      Name: "ZCO_IF_WBS_LIST",
      TriggeredBy: "BSGON",
      Path: "/rfc",
    },
    ["IF-CO-010"]: {
      Type: "RFC",
      Name: "ZCO_IF_HR_DEPT",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-CO-010-BATCH"]: {
      Type: "API-RFC",
      Name: "ZCO_IF_HR_DEPT",
      TriggeredBy: "EAI",
      Path: "/",
    },
    ["IF-CO-011"]: {
      Type: "RFC",
      Name: "ZCO_IF_HR_EMPLOYEE",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-CO-011-BATCH"]: {
      Type: "API-RFC",
      Name: "ZCO_IF_HR_EMPLOYEE",
      TriggeredBy: "EAI",
      Path: "/",
    },
    ["IF-CO-013"]: {
      Type: "RFC",
      Name: "ZCO_IF_CONTRACT",
      TriggeredBy: "CONTRACT",
      Path: "/rfc_contract",
    },
    ["IF-CO-035"]: {
      Type: "RFC",
      Name: "ZCO_IF_HR_EMPLOYEE_ORDER",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-CO-035-BATCH"]: {
      Type: "API-RFC",
      Name: "ZCO_IF_HR_EMPLOYEE_ORDER",
      TriggeredBy: "EAI",
      Path: "/",
    },
    ["IF-CO-036"]: {
      Type: "RFC",
      Name: "ZCO_IF_TIMESHEET_INPUT_GUBUN",
      TriggeredBy: "TIMESHEET",
      Path: "/rfc",
    },
    ["IF-CO-037"]: {
      Type: "RFC",
      Name: "ZCO_IF_CCTR_LIST",
      TriggeredBy: "BSGON",
      Path: "/rfc",
    },
    ["IF-CT-002"]: {
      Type: "API",
      Name: "POST_DRAFT",
      TriggeredBy: "CONTRACT",
      Path: "/gpro",
    },
    ["IF-CT-003"]: {
      Type: "WEBHOOK",
      Name: "DRAFT_UPDATED",
      TriggeredBy: "G_PRO",
      Path: "/gpro",
    },
    ["IF-CT-007"]: {
      Type: "API",
      Name: "CT_TEMPLATE_LIST",
      TriggeredBy: "UNIPOST",
      Path: "/unipost",
    },
    ["IF-CT-008"]: {
      Type: "API",
      Name: "CT_TOKEN_4_WRITING",
      TriggeredBy: "UNIPOST",
      Path: "/unipost",
    },
    ["IF-CT-009"]: {
      Type: "API",
      Name: "CT_TOKEN_4_READING",
      TriggeredBy: "UNIPOST",
      Path: "/unipost",
    },
    ["IF-CT-011"]: {
      Type: "WEBHOOK",
      Name: "CT_CHANGED",
      TriggeredBy: "UNIPOST",
      Path: "/uni_contract_webhook",
    },
    ["IF-FI-001"]: {
      Type: "RFC",
      Name: "ZFI_IF_STD_CODE",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-FI-002"]: {
      Type: "RFC",
      Name: "ZFI_IF_GWP_FIDOC",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-FI-003"]: {
      Type: "RFC",
      Name: "ZFI_IF_GWP_UNITAX",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-FI-004"]: {
      Type: "API",
      Name: "REVERSE_FI_DOC",
      TriggeredBy: "SAP",
      Path: "/gpro",
    },
    ["IF-FI-011"]: {
      Type: "RFC",
      Name: "ZFI_IF_STD_CODE",
      TriggeredBy: "CONTRACT",
      Path: "/rfc_contract",
    },
    ["IF-FI-012"]: {
      Type: "RFC",
      Name: "ZFI_IF_CONTRT_FIDOC",
      TriggeredBy: "CONTRACT",
      Path: "/rfc_contract",
    },
    ["IF-FI-013"]: {
      Type: "RFC",
      Name: "ZFI_IF_STD_CODE",
      TriggeredBy: "BSGON",
      Path: "/rfc",
    },
    ["IF-FI-015"]: {
      Type: "RFC",
      Name: "ZFI_IF_BSGON_FIDOC",
      TriggeredBy: "BSGON",
      Path: "/rfc",
    },
    ["IF-FI-018"]: {
      Type: "RFC",
      Name: "ZFI_IF_GWP_FIDOC",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-FI-021"]: {
      Type: "RFC",
      Name: "ZFI_IF_GWP_FIDOC_APLV",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-MM-001"]: {
      Type: "RFC",
      Name: "ZMM_MASTER_LIST",
      TriggeredBy: "CONTRACT",
      Path: "/rfc_contract",
    },
    ["IF-MM-002"]: {
      Type: "RFC",
      Name: "ZMM_PO_CREATION",
      TriggeredBy: "CONTRACT",
      Path: "/rfc_contract",
    },
    ["IF-MM-003"]: {
      Type: "RFC",
      Name: "ZMM_PO_CHANGE",
      TriggeredBy: "CONTRACT",
      Path: "/rfc_contract",
    },
    ["IF-WS-001"]: {
      Type: "RFC",
      Name: "ZSIRFC1049",
      TriggeredBy: "WORKSHEET",
      Path: "/rfc",
    },
    ["IF-TS-001"]: {
      Type: "RFC",
      Name: "ZSIRFC2010",
      TriggeredBy: "TIMESHEET",
      Path: "/rfc",
    },
    ["IF-TS-002"]: {
      Type: "RFC",
      Name: "ZSIRFC2030",
      TriggeredBy: "TIMESHEET",
      Path: "/rfc",
    },
    ["IF-TS-003"]: {
      Type: "RFC",
      Name: "ZSIRFC2045",
      TriggeredBy: "TIMESHEET",
      Path: "/rfc",
    },
    ["IF-TS-004"]: {
      Type: "RFC",
      Name: "ZSIRFC2040",
      TriggeredBy: "TIMESHEET",
      Path: "/rfc",
    },
    ["IF-TS-005"]: {
      Type: "RFC",
      Name: "ZSIRFC2015",
      TriggeredBy: "TIMESHEET",
      Path: "/rfc",
    },
    ["IF-TS-006"]: {
      Type: "RFC",
      Name: "ZSIRFC2016",
      TriggeredBy: "TIMESHEET",
      Path: "/rfc",
    },
    ["IF-TS-007"]: {
      Type: "RFC",
      Name: "ZSIRFC2060",
      TriggeredBy: "TIMESHEET",
      Path: "/rfc",
    },
    ["IF-TS-008"]: {
      Type: "RFC",
      Name: "ZSIRFC2070",
      TriggeredBy: "TIMESHEET",
      Path: "/rfc",
    },
    ["IF-WS-002"]: {
      Type: "RFC",
      Name: "ZSIRFC1030",
      TriggeredBy: "WORKSHEET",
      Path: "/rfc",
    },
    ["IF-WS-003"]: {
      Type: "RFC",
      Name: "ZSIRFC1043",
      TriggeredBy: "WORKSHEET",
      Path: "/rfc",
    },
    ["IF-WS-004"]: {
      Type: "RFC",
      Name: "ZSIRFC1048",
      TriggeredBy: "WORKSHEET",
      Path: "/rfc",
    },
    // ["IF-SD-GBS04"]: {
    //   Type: "API",
    //   Name: "SHOPS",
    //   TriggeredBy: "SAP",
    //   UrlPath: "/v1/sap-interface/eai/shop",
    //   BodyToQueryString: false,
    //   HttpHeaders: {
    //     "Content-Type": "application/json",
    //   },
    //   Path: "/gbos",
    // },
    // ["IF-CO-SAC02"]: {
    //   Type: "DB",
    //   Name: "OEPROFITLOSS_GDRA_LOG",
    //   RfcName: "ZCO_IF_SAC02",
    // },
    ["IF-CT-101"]: {
      Type: "DB",
      Name: "GET_DATA_FROM_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-102"]: {
      Type: "DB",
      Name: "POST_DATA_TO_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-103"]: {
      Type: "DB",
      Name: "PATCH_DATA_OF_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-105"]: {
      Type: "DB",
      Name: "GET_CONTRACT_LIST_FROM_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-106"]: {
      Type: "DB",
      Name: "GET_PARTY_LIST_FROM_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-109"]: {
      Type: "DB",
      Name: "GET_CHANGED_HISTORY",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-110"]: {
      Type: "DB",
      Name: "UPDATE_WBS_CONTRACT",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-111"]: {
      Type: "DB",
      Name: "GET_BILLING_DATA_FROM_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-112"]: {
      Type: "DB",
      Name: "POST_BILLING_DATA_TO_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-113"]: {
      Type: "DB",
      Name: "PATCH_BILLING_DATA_OF_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-115"]: {
      Type: "DB",
      Name: "GET_BILLING_LIST_FROM_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-FU-101"]: {
      Type: "FU",
      Name: "GET_FILE_UPLOAD_URL",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
  };

  await file.upload("if/list.json", interfaces, {
    gzip: true,
    stage: env.CURRENT_ALIAS,
  });
  const url = await file.getUrl("if/list.json", { stage: env.CURRENT_ALIAS });

  draft.response.body = {
    url,
    count: Object.keys(interfaces).length,
    list: interfaces,
  };
};
