module.exports = async (draft, { file }) => {
  const interfaces = {
    systems: {
      // BZM: {
      //   name: "비즈몰",
      //   domains: {
      //     dev: "http://bizmall.dev.golfzon.com",
      //     qas: "http://bizmall.qa.golfzon.com",
      //     prd: "http://bizmalladmin.golfzon.com",
      //   },
      // },
      // GBOS: {
      //   domains: {
      //     dev: "qas",
      //     qas: "https://fairway.spazon.com",
      //     prd: "http://fairway.golfzon.local",
      //   },
      //   headers: {
      //     dev: "qas",
      //     qas: {
      //       apikey: "sap-nsonMh8cXLN6FHw5T6XO1QCqsppvEkcn",
      //     },
      //     prd: {
      //       apikey: "sap-Y2ZtdKBWIvbr6vWc6cxoppMqWdXOmoQr",
      //     },
      //   },
      // },
      // GDRBI: {
      //   domains: {
      //     dev: "DB:VDGZ-MSDEV01.GFZ.CORP:10024",
      //     //VDGZ-MSDEV01.GFZ.CORP//172.20.43.13
      //     qas: "dev",
      //     prd: "DB:PLGZ-GDRDWDB.GFZ.CORP:1433",
      //     //PLGZ-GDRDWDB.GFZ.CORP//192.168.20.91
      //   },
      //   dbNames: {
      //     dev: "GDR_DW_DB",
      //     qas: "dev",
      //     prd: "GOLFZON_GDRDW_DB",
      //   },
      // },
    },
    prefixes: {
      // "IF-FI-BZM": "BZM",
      // "IF-SD-BZ": "BZM",
      // "IF-SD-GBS": "GBOS",
      // "IF-FI-PLS": "MEMBER_PLATFORM",
      // "IF-FI-GMB": "MEMBER_PLATFORM",
    },
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
      Type: "RFC",
      Name: "GET_DATA_FROM_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-102"]: {
      Type: "RFC",
      Name: "POST_DATA_TO_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-103"]: {
      Type: "RFC",
      Name: "PATCH_DATA_OF_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-CT-105"]: {
      Type: "RFC",
      Name: "GET_CONTRACT_LIST_FROM_DB",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
    ["IF-FU-101"]: {
      Type: "RFC",
      Name: "FILE_UPLOAD",
      RfcName: "",
      TriggeredBy: "SUPPORT",
    },
  };

  await file.upload("if/list.json", interfaces, { gzip: true });
  const url = await file.getUrl("if/list.json");

  draft.response.body = {
    url,
    count: Object.keys(interfaces).length,
    list: interfaces,
  };
};
