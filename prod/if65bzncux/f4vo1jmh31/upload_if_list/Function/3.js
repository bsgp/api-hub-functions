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
      Path: "/rfc",
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
      Path: "/rfc",
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
    ["IF-CO-011"]: {
      Type: "RFC",
      Name: "ZCO_IF_HR_EMPLOYEE",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
    },
    ["IF-CO-013"]: {
      Type: "RFC",
      Name: "ZCO_IF_CONTRACT",
      TriggeredBy: "CONTRACT",
      Path: "/rfc",
    },
    ["IF-CO-035"]: {
      Type: "RFC",
      Name: "ZCO_IF_HR_EMPLOYEE_ORDER",
      TriggeredBy: "G_PRO",
      Path: "/rfc",
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
    ["IF-FI-011"]: {
      Type: "RFC",
      Name: "ZFI_IF_STD_CODE",
      TriggeredBy: "CONTRACT",
      Path: "/rfc",
    },
    ["IF-FI-012"]: {
      Type: "RFC",
      Name: "ZFI_IF_CONTRT_FIDOC",
      TriggeredBy: "CONTRACT",
      Path: "/rfc",
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
      Path: "/rfc",
    },
    ["IF-MM-002"]: {
      Type: "RFC",
      Name: "ZMM_PO_CREATION",
      TriggeredBy: "CONTRACT",
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
