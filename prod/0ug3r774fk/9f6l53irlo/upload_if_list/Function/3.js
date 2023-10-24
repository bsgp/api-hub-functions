module.exports = async (draft, { file }) => {
  const interfaces = {
    "IF-PMM-AUTH01": {
      Type: "RFC",
      Name: "CHECK_AUTH",
      RfcName: "SUSR_LOGIN_CHECK_RFC",
      TriggeredBy: "PMM",
    },
    "IF-PMM-ORD01": {
      Type: "RFC",
      Name: "MY_WORK_ORDERS",
      RfcName: "ZPM_SEND_ORD_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-ORD02": {
      Type: "RFC",
      Name: "WORK_ORDER",
      RfcName: "ZPM_SEND_ORD_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-ORD03": {
      Type: "RFC",
      Name: "EQUIPMENT_HISTORY_ORDERS",
      RfcName: "ZPM_SEND_ORD_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-ORD04": {
      Type: "RFC",
      Name: "ORDER_DETAIL",
      RfcName: "ZPM_SEND_ORD_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-ORD05": {
      Type: "RFC",
      Name: "WORK_ORDER_LIST",
      RfcName: "ZPM_SEND_ORD_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-ORD07": {
      Type: "RFC",
      Name: "GET_TEMP_PMM_ORDERS",
      RfcName: "ZPM_SEND_ORD_TEMPSAVE",
      TriggeredBy: "PMM",
    },
    "IF-PMM-ORD08": {
      Type: "RFC",
      Name: "TEMP_ACTIVITY_PMM_ORDERS",
      RfcName: "ZPM_RECEIVE_ORD_TEMPSAVE",
      TriggeredBy: "PMM",
    },
    "IF-PMM-ORD09": {
      Type: "RFC",
      Name: "CREATE_PMM_ORDERS",
      RfcName: "ZPM_RECEIVE_ORDER_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-ORD10": {
      Type: "RFC",
      Name: "ACTIVITY_PMM_ORDERS",
      RfcName: "ZPM_RECEIVE_MAINT_RESULT",
      TriggeredBy: "PMM",
    },
    "IF-PMM-ORD11": {
      Type: "RFC",
      Name: "WORK_ORDER_TYPE",
      RfcName: "ZPM_SEND_NOTI_ORD_TYPE",
      TriggeredBy: "PMM",
    },
    "IF-PMM-PLT01": {
      Type: "RFC",
      Name: "PLANT_LIST",
      RfcName: "ZPM_SEND_PLANT",
      TriggeredBy: "PMM",
    },
    "IF-PMM-WC01": {
      Type: "RFC",
      Name: "MY_WORKCENTER",
      RfcName: "ZPM_SEND_WORKCENTER",
      TriggeredBy: "PMM",
    },
    "IF-PMM-EQ01": {
      Type: "RFC",
      Name: "EQUIPMENT_LIST",
      RfcName: "ZPM_SEND_EQUI_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-EQ02": {
      Type: "RFC",
      Name: "EQUIPMENT",
      RfcName: "ZPM_SEND_EQUI_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-EQ03": {
      Type: "RFC",
      Name: "EQUIPMENT_HIERARCHY",
      RfcName: "ZPM_SEND_EQUI_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-EQ05": {
      Type: "RFC",
      Name: "EQUIPMENT_TASK_LIST",
      RfcName: "ZPM_SEND_TASKLIST_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-NOTI01": {
      Type: "RFC",
      Name: "CREATE_PMM_NOTIFY",
      RfcName: "ZPM_RECEIVE_NOTI_CREATE",
      TriggeredBy: "PMM",
    },
    "IF-PMM-NOTI05": {
      Type: "RFC",
      Name: "NOTIFY_TYPE",
      RfcName: "ZPM_SEND_NOTI_ORD_TYPE",
      TriggeredBy: "PMM",
    },
    "IF-PMM-CAT01": {
      Type: "RFC",
      Name: "CATALOG_LIST",
      RfcName: "ZPM_SEND_CATALOG",
      TriggeredBy: "PMM",
    },
    "IF-PMM-CC01": {
      Type: "RFC",
      Name: "CATALOG_LIST",
      RfcName: "ZPM_SEND_CHECK_CODE",
      TriggeredBy: "PMM",
    },
    "IF-PMM-FL01": {
      Type: "RFC",
      Name: "FUNCTIONAL_LOCATION",
      RfcName: "ZPM_SEND_EQUI_INFO",
      TriggeredBy: "PMM",
    },
    "IF-PMM-SL01": {
      Type: "RFC",
      Name: "SITE_LOGISTIC",
      RfcName: "ZPM_SEND_SL",
      TriggeredBy: "PMM",
    },
    "IF-PMM-MAT01": {
      Type: "RFC",
      Name: "MATERIAL_DETAIL",
      RfcName: "ZPM_SEND_MATERIAL",
      TriggeredBy: "PMM",
    },
  };
  // df
  await file.upload("if/list.json", interfaces, { gzip: true });
  const url = await file.getUrl("if/list.json");

  draft.response.body = {
    url,
    count: Object.keys(interfaces).length,
    list: interfaces,
  };
};
