module.exports = async (draft, { file }) => {
  const interfaces = {
    systems: {
      BZM: {
        name: "비즈몰",
        domains: {
          dev: "http://bizmall.dev.golfzon.com",
          qas: "http://bizmall.qa.golfzon.com",
          prd: "http://bizmalladmin.golfzon.com",
        },
      },
      GBOS: {
        domains: {
          dev: "qas",
          qas: "https://fairway.spazon.com",
          prd: "http://fairway.golfzon.local",
        },
        headers: {
          dev: "qas",
          qas: {
            apikey: "sap-nsonMh8cXLN6FHw5T6XO1QCqsppvEkcn",
          },
          prd: {
            apikey: "sap-Y2ZtdKBWIvbr6vWc6cxoppMqWdXOmoQr",
          },
        },
      },
      DRW: {
        name: "통합계정",
        domains: {
          dev: "qas",
          qas: "prd",
          prd: "http://drwapi.golfzon.local:8880",
        },
      },
      IGMS: {
        name: "골프존 커머스",
        domains: {
          dev: "http://10.14.1.12:9080",
          qas: "dev",
          // prd: "http://121.254.184.161",
          // prd: "http://172.20.140.27:58080",
          prd: "http://igmsapi.golfzonretail.com",
        },
      },
      GTC: {
        name: "페이레터",
        domains: {
          dev: "qas",
          qas: "http://billadminqa.golfnculture.local",
          prd: "http://billadmin.golfnculture.local",
        },
      },
      GSPOS: {
        domains: {
          dev: "qas",
          qas: "http://fcm.qa.golfzonpark.com:8000",
          prd: "http://fcm.golfzonpark.com:8000",
        },
        headers: {
          dev: "qas",
          qas: "prd",
          prd: {
            "Content-Type": "application/json",
          },
        },
      },
      MEMBER_PLATFORM: {
        name: "플러스샵, G멤버십, GL캐시, 마일리지",
        domains: {
          //"http://dataapidev.golfzon.local:8085",
          dev: "http://dataapidev.golfzon.local:8085",
          qas: "http://dataapiqa.golfzon.local:8085",
          prd: "http://dataapi.golfzon.local:8085",
        },
      },
      GDR: {
        domains: {
          dev: "qas",
          qas: "https://gdrbillapi.qa.golfzon.local",
          prd: "https://gdrbillapi.golfzon.local",
        },
      },
      VOC: {
        domains: {
          dev: "qas",
          qas: "http://cscapi.qa.golfzon.com:7070",
          prd: "http://cscapi.golfzon.com",
        },
      },
      GDRBI: {
        domains: {
          dev: "DB:VDGZ-MSDEV01.GFZ.CORP:10024",
          //VDGZ-MSDEV01.GFZ.CORP//172.20.43.13
          qas: "dev",
          prd: "DB:PLGZ-GDRDWDB.GFZ.CORP:1433",
          //PLGZ-GDRDWDB.GFZ.CORP//192.168.20.91
        },
        dbNames: {
          dev: "GDR_DW_DB",
          qas: "dev",
          prd: "GOLFZON_GDRDW_DB",
        },
      },
    },
    prefixes: {
      "IF-FI-BZM": "BZM",
      "IF-SD-BZ": "BZM",
      "IF-SD-GBS": "GBOS",
      "IF-SD-GPM": "GBOS",
      "IF-FI-DRW": "DRW",
      "IF-FI-GMS": "IGMS",
      "IF-FI-GTC": "GTC",
      "IF-SD-GSP": "GSPOS",
      "IF-FI-PLS": "MEMBER_PLATFORM",
      "IF-FI-GMB": "MEMBER_PLATFORM",
      "IF-FI-GLS": "MEMBER_PLATFORM",
      "IF-FI-MLG": "MEMBER_PLATFORM",
      "IF-SD-PLS": "MEMBER_PLATFORM",
      "IF-SD-GMR": "MEMBER_PLATFORM",
      "IF-SD-GLC": "MEMBER_PLATFORM",
      "IF-SD-GDR": "GDR",
      "IF-FI-GDR": "GDR",
      "IF-FI-GDS": "GDR",
      "IF-FI-MLP": "MEMBER_PLATFORM",
      "IF-LE-VOC": "VOC",
      "IF-SD-VOC": "VOC",
      "IF-MM-MMS": "VOC",
      "IF-SD-SMS": "MEMBER_PLATFORM",
      "IF-SD-SRL": "MEMBER_PLATFORM",
      "IF-SD-ACC": "MEMBER_PLATFORM",
      "IF-CO-SAC": "GDRBI",
    },
    ["IF-CT-011"]: {
      Type: "WEBHOOK",
      Name: "CT_CHANGED",
      TriggeredBy: "UNIPOST",
      // UrlPath: "/gz/erp/iffibzm.do",
      Path: "/uni_contract_webhook",
    },
    ["IF-FI-001"]: {
      Type: "RFC",
      Name: "ZFI_IF_STD_CODE",
      TriggeredBy: "G-PRO",
      // UrlPath: "/gz/erp/iffibzm.do",
      Path: "/rfc",
    },
    ["IF-FI-002"]: {
      Type: "RFC",
      Name: "ZFI_IF_GWP_FIDOC",
      TriggeredBy: "SAP",
      // UrlPath: "/gz/erp/iffibzm.do",
      Path: "/rfc",
    },
    ["IF-FI-021"]: {
      Type: "RFC",
      Name: "ZFI_IF_GWP_FIDOC_APLV",
      TriggeredBy: "SAP",
      // UrlPath: "/gz/erp/iffibzm.do",
      Path: "/rfc",
    },
    ["IF-SD-BZ002"]: {
      Type: "API",
      Name: "SALES",
      TriggeredBy: "SAP",
      UrlPath: "/gz/erp/sap_account.do",
      Path: "/bzm",
    },
    ["IF-SD-BZ004"]: {
      Type: "API",
      Name: "DIRECT_GI",
      TriggeredBy: "SAP",
      UrlPath: "/gz/erp/sap_account.do",
      Path: "/bzm",
    },
    ["IF-SD-BZ005"]: {
      Type: "API",
      Name: "CONFIRMED_SALES",
      TriggeredBy: "SAP",
      UrlPath: "/gz/erp/sap_account_sp.do",
      Path: "/bzm",
    },
    ["IF-SD-VOC01"]: {
      Type: "RFC",
      Name: "ZSD_SEND_BP_INFORM",
      TriggeredBy: "GBOS",
      Path: "/rfc",
    },
    ["IF-SD-VOC02"]: {
      Type: "RFC",
      Name: "ZSD_SEND_DISTCD",
      TriggeredBy: "GBOS",
      Path: "/rfc",
    },
    ["IF-SD-VOC03"]: {
      Type: "RFC",
      Name: "ZSD_SEND_EMPLID",
      TriggeredBy: "GBOS",
      Path: "/rfc",
    },
    ["IF-SD-GPM01"]: {
      Type: "RFC",
      Name: "ZSD_STATNUM_ASSIGN_FROM_GPM",
      TriggeredBy: "GBOS",
      Path: "/rfc",
    },
    // ["IF-SD-GPM02"]: {
    //   Type: "RFC",
    //   Name: "ZSD_STATNUM_ASSIGN_FROM_GPM",
    //   TriggeredBy: "GBOS",
    // },
    ["IF-SD-GBS01"]: {
      Type: "RFC",
      Name: "ZSD_SNUM_EMPID_CHECK_FROM_GBOS",
      TriggeredBy: "GBOS",
      Path: "/rfc",
    },
    ["IF-SD-GBS02"]: {
      Type: "RFC",
      Name: "ZSD_JOINSTAT_UPDATE_FROM_GBOS",
      TriggeredBy: "GBOS",
      Path: "/rfc",
    },
    ["IF-SD-GBS03"]: {
      Type: "RFC",
      Name: "ZSD_KUNNR_INFORM_FROM_GBOS",
      TriggeredBy: "GBOS",
      Path: "/rfc",
    },
    ["IF-SD-GBS04"]: {
      Type: "API",
      Name: "SHOPS",
      TriggeredBy: "SAP",
      UrlPath: "/v1/sap-interface/eai/shop",
      BodyToQueryString: false,
      HttpHeaders: {
        "Content-Type": "application/json",
      },
      Path: "/gbos",
    },
    ["IF-SD-GBS05"]: {
      Type: "API",
      Name: "LOCKKEY",
      TriggeredBy: "SAP",
      UrlPath: "/v1/sap-interface/eai/machine",
      BodyToQueryString: false,
      HttpHeaders: {
        "Content-Type": "application/json",
      },
      Path: "/gbos",
    },
    ["IF-FI-DRW01"]: {
      Type: "API",
      Name: "getPerson",
      TriggeredBy: "SAP",
      RfcName: "ZFI_IF_DRW_EMPINFO_RCV",
      UrlPath: "/DrwBizIF/igroupware.asmx",
      Path: "/drw",
    },
    ["IF-FI-CMS04"]: {
      Type: "RFC",
      Name: "ZFI_IF_CMS_TRADING_LIST",
      TriggeredBy: "CMS",
    },
    ["IF-FI-CMS05"]: {
      Type: "RFC",
      Name: "ZFI_IF_CMS_VACC_RECEIVED",
      TriggeredBy: "CMS",
    },
    ["IF-FI-CMS06"]: {
      Type: "RFC",
      Name: "ZFI_IF_CMS_CRE_EXCHANGE_RATE",
      TriggeredBy: "CMS",
    },
    ["IF-FI-GMS01"]: {
      Type: "API",
      Name: "GM_SALES",
      UrlPath: "/cmm/erp/zfiIfGmSales",
      TriggeredBy: "SAP",
      Path: "/gms",
    },
    ["IF-FI-GMS02"]: {
      Type: "API",
      Name: "GM_PAYMENT",
      UrlPath: "/cmm/erp/zfiIfGmPayment",
      TriggeredBy: "SAP",
      Path: "/gms",
    },
    ["IF-FI-GMS03"]: {
      Type: "API",
      Name: "GM_PURCHASE",
      UrlPath: "/cmm/erp/zfiIfGmPurchase",
      TriggeredBy: "SAP",
      Path: "/gms",
    },
    ["IF-FI-GMS04"]: {
      Type: "API",
      Name: "GM_COGS",
      UrlPath: "/cmm/erp/zfiIfGmCogs",
      TriggeredBy: "SAP",
      Path: "/gms",
    },
    ["IF-FI-GMS05"]: {
      Type: "API",
      Name: "GM_MALL_PAYMENT",
      UrlPath: "/cmm/erp/zfiIfGmMallPayment",
      // http://112.216.91.202:9080
      TriggeredBy: "SAP",
      Path: "/gms",
    },
    ["IF-FI-GTC01"]: {
      Type: "API",
      Name: "SALES",
      UrlPath: "/View/ERP/Handler/SAPHandler.ashx",
      TriggeredBy: "SAP",
      Path: "/gtc",
    },
    ["IF-FI-GTC02"]: {
      Type: "API",
      Name: "USAGE",
      UrlPath: "/View/ERP/Handler/SAPHandler.ashx",
      TriggeredBy: "SAP",
      Path: "/gtc",
    },
    ["IF-FI-GTC03"]: {
      Type: "API",
      Name: "PAYMENT",
      UrlPath: "/View/ERP/Handler/SAPHandler.ashx",
      TriggeredBy: "SAP",
      Path: "/gtc",
    },
    ["IF-FI-GTC04"]: {
      Type: "API",
      Name: "EXPIRE",
      UrlPath: "/View/ERP/Handler/SAPHandler.ashx",
      TriggeredBy: "SAP",
      Path: "/gtc",
    },
    ["IF-SD-GSP01"]: {
      Type: "API",
      Name: "PROD",
      UrlPath: "/selectData",
      BodyToQueryString: false,
      TriggeredBy: "SAP",
      Path: "/gsp",
    },
    ["IF-SD-GSP02"]: {
      Type: "API",
      Name: "SALES",
      UrlPath: "/selectData",
      BodyToQueryString: false,
      TriggeredBy: "SAP",
      Path: "/gsp",
    },
    ["IF-SD-GSP03"]: {
      Type: "API",
      Name: "PAYS",
      UrlPath: "/selectData",
      BodyToQueryString: false,
      TriggeredBy: "SAP",
      Path: "/gsp",
    },
    ["IF-FI-PLS01"]: {
      Type: "API",
      Name: "PAYS",
      UrlPath: "/shop_pay",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-PLS02"]: {
      Type: "API",
      Name: "REFUND",
      UrlPath: "/shop_pay",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-PLS03"]: {
      Type: "API",
      Name: "EXPIRE",
      UrlPath: "/shop_pay",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-GMB01"]: {
      Type: "API",
      Name: "PAYS",
      UrlPath: "/gmember_pay",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-GMB02"]: {
      Type: "API",
      Name: "REFUND",
      UrlPath: "/gmember_pay",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-GLS01"]: {
      Type: "API",
      Name: "PAYS",
      UrlPath: "/cash",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-GLS02"]: {
      Type: "API",
      Name: "REFUND",
      UrlPath: "/cash",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-MLG01"]: {
      Type: "API",
      Name: "COLLECT_EARN",
      UrlPath: "/mileage",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-MLG02"]: {
      Type: "API",
      Name: "COLLECT_LOSE",
      UrlPath: "/mileage",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-MLG03"]: {
      Type: "API",
      Name: "REFUND_EARN",
      UrlPath: "/mileage",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-MLG04"]: {
      Type: "API",
      Name: "REFUND_USE",
      UrlPath: "/mileage",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-MLG05"]: {
      Type: "API",
      Name: "REFUND_LOSE",
      UrlPath: "/mileage",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-MLG06"]: {
      Type: "API",
      Name: "COLLECT_USE",
      UrlPath: "/mileage",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-MLG07"]: {
      Type: "API",
      Name: "MINUS",
      UrlPath: "/mileage",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-SD-PLS01"]: {
      Type: "API",
      Name: "PAYS",
      UrlPath: "/service_settle",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-SD-GMR01"]: {
      Type: "API",
      Name: "SALES",
      UrlPath: "/service_settle",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-SD-GLC01"]: {
      Type: "API",
      Name: "SALES",
      UrlPath: "/usecash",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-SD-GDR01"]: {
      Type: "API",
      Name: "SALES_BILLING",
      UrlPath: "/ERP/GASD",
      BodyToQueryString: false,
      TriggeredBy: "SAP",
      Path: "/gdr",
    },
    ["IF-SD-GDR02"]: {
      Type: "API",
      Name: "SALES_SHOP",
      UrlPath: "/ERP/GDRSHOPSD",
      BodyToQueryString: false,
      TriggeredBy: "SAP",
      Path: "/gdr",
    },
    ["IF-FI-GDR01"]: {
      Type: "API",
      Name: "CASH",
      UrlPath: "/ERP/GAFI",
      BodyToQueryString: false,
      TriggeredBy: "SAP",
      Path: "/gdr",
    },
    ["IF-FI-GDR02"]: {
      Type: "API",
      Name: "CARD",
      UrlPath: "/ERP/GAFI",
      BodyToQueryString: false,
      TriggeredBy: "SAP",
      Path: "/gdr",
    },
    ["IF-FI-GDS01"]: {
      Type: "API",
      Name: "PAYS",
      UrlPath: "/ERP/GDRSHOPFI",
      BodyToQueryString: false,
      TriggeredBy: "SAP",
      Path: "/gdr",
    },
    ["IF-FI-GDS02"]: {
      Type: "API",
      Name: "EXPIRE",
      UrlPath: "/ERP/GDRSHOPFI",
      BodyToQueryString: false,
      TriggeredBy: "SAP",
      Path: "/gdr",
    },
    ["IF-FI-MLP01"]: {
      Type: "API",
      Name: "COLLECT",
      UrlPath: "/gpass_pay",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-MLP02"]: {
      Type: "API",
      Name: "LOSE",
      UrlPath: "/gpass_pay",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-FI-MLP03"]: {
      Type: "API",
      Name: "USE",
      UrlPath: "/gpass_pay",
      TriggeredBy: "SAP",
      Path: "/mp",
    },
    ["IF-LE-VOC01"]: {
      Type: "API",
      Name: "ZLE_VOC_GOODS",
      UrlPath: "/api/sap/insert_install_item.do",
      TriggeredBy: "SAP",
      BodyToQueryString: false,
      HttpHeaders: {
        "Content-Type": "application/json",
      },
      Path: "/voc",
    },
    ["IF-LE-VOC02"]: {
      Type: "API",
      Name: "ZLE_VOC_GOODS_GI",
      UrlPath: "/api/sap/insert_crm_install.do",
      TriggeredBy: "SAP",
      BodyToQueryString: false,
      HttpHeaders: {
        "Content-Type": "application/json",
      },
      Path: "/voc",
    },
    ["IF-LE-VOC03"]: {
      Type: "API",
      Name: "ZLE_VOC_GOODS_BOM",
      UrlPath: "/api/sap/insert_crm_install_det.do",
      TriggeredBy: "SAP",
      BodyToQueryString: false,
      HttpHeaders: {
        "Content-Type": "application/json",
      },
      Path: "/voc",
    },
    ["IF-LE-VOC04"]: {
      Type: "API",
      Name: "UPDATE_CUSTOMER",
      UrlPath: "/api/sap/insert_union_cust.do",
      TriggeredBy: "SAP",
      BodyToQueryString: false,
      HttpHeaders: {
        "Content-Type": "application/json",
      },
      Path: "/voc",
    },
    ["IF-MM-MMS01"]: {
      Type: "API",
      Name: "MATERIALS",
      UrlPath: "/api/sap/insert_mms_item_master.do",
      TriggeredBy: "SAP",
      BodyToQueryString: false,
      HttpHeaders: {
        "Content-Type": "application/json",
      },
      Path: "/voc",
    },
    ["IF-SD-SMS01"]: {
      Type: "API",
      Name: "SEND_SMS",
      UrlPath: "/smsservice",
      TriggeredBy: "SAP",
      HttpHeaders: {
        "Content-Type": "application/json",
      },
      Path: "/mp",
    },
    ["IF-SD-SRL01"]: {
      Type: "API",
      Name: "SERIAL_NUMBER",
      UrlPath: "/serial",
      TriggeredBy: "SAP",
      HttpHeaders: {
        "Content-Type": "application/json",
      },
      Path: "/mp",
    },
    ["IF-SD-ACC01"]: {
      Type: "API",
      Name: "SO_INFO",
      UrlPath: "/so",
      TriggeredBy: "SAP",
      // HttpMethod: "GET",
      // BodyToQueryString: false,
      // HttpHeaders: {
      //   "Content-Type": "application/json",
      // },
      Path: "/mp",
    },
    ["IF-CO-SAC01"]: {
      Type: "DB",
      Name: "OEFSACCTSETUP_LOG",
      RfcName: "ZCO_IF_SAC01",
    },
    ["IF-CO-SAC02"]: {
      Type: "DB",
      Name: "OEPROFITLOSS_GDRA_LOG",
      RfcName: "ZCO_IF_SAC02",
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
