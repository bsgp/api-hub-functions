module.exports = async (draft, { file }) => {
  const interfaces = {
    ["PRM-101"]: {
      FunctionName: "Z09CSREADCUSDATA",
    },
    ["PRM-102"]: {
      FunctionName: "Z09CSREADBYNAME",
    },
    ["PRM-103"]: {
      FunctionName: "Z09CSADDBIKE",
    },
    ["PRM-104"]: {
      FunctionName: "Z09CSMODEL",
    },
    ["PRM-105"]: {
      FunctionName: "Z09CSREADVINNO",
    },
    ["PRM-106"]: {
      FunctionName: "Z09CSREADDEALER",
    },
    ["PRM-107"]: {
      FunctionName: "Z09CSCHANGEBIKE",
    },
    ["PRM-108"]: {
      FunctionName: "Z09CSADDCUSTOMER",
    },
    ["PRM-109"]: {
      FunctionName: "Z09CSCHANGECUST",
    },
    ["PRM-110"]: {
      FunctionName: "Z09CSREADPOSTCODE",
    },
    ["PRM-111"]: {
      FunctionName: "Z09CSWDISPATCH",
    },
    ["PRM-112"]: {
      FunctionName: "Z09CSCANCELWNOTI",
    },
    ["PRM-113"]: {
      FunctionName: "Z09CSREADCUSDATA",
    },
    ["PRM-114"]: {
      FunctionName: "Z09CSGINOTICHG",
    },
    ["PRM-115"]: {
      FunctionName: "Z09CSWATLIST",
    },
    ["PRM-116"]: {
      FunctionName: "Z09CSWADETAIL",
    },
    ["PRM-117"]: {
      FunctionName: "Z09CSCODEPOPUP",
    },
    ["PRM-118"]: {
      FunctionName: "Z09CSCONSIGNSTOCK",
    },
    ["PRM-119"]: {
      FunctionName: "Z09CSGI",
    },
    ["PRM-120"]: {
      FunctionName: "Z09CSCANCELGI",
    },
    ["PRM-121"]: {
      FunctionName: "Z09CSMATERIAL",
    },
    ["PRM-122"]: {
      FunctionName: "Z09CSWADETAIL",
    },
    ["PRM-124"]: {
      FunctionName: "Z09CSSAVEWARR",
    },
    ["PRM-125"]: {
      FunctionName: "Z09CSLISTVEHICLE",
    },
    ["PRM-126"]: {
      FunctionName: "Z09CSLDISPATCH",
    },
    ["PRM-127"]: {
      FunctionName: "Z09CSLEASELIST",
    },
    ["PRM-128"]: {
      FunctionName: "Z09CSLEASEDETAIL",
    },
    ["PRM-130"]: {
      FunctionName: "Z09CSSAVELEASE",
    },
    ["PRM-131"]: {
      FunctionName: "Z09CSLEASEMAT",
    },
    ["PRM-132"]: {
      FunctionName: "Z09CSSVCHISTORY",
    },
    ["PRM-133"]: {
      FunctionName: "Z09CSWARRPAYMENT",
    },
    ["PRM-134"]: {
      FunctionName: "Z09CSLEASEPAYMENT",
    },
    ["PRM-135"]: {
      FunctionName: "Z09CSGIDONG",
    },
    ["PRM-136"]: {
      FunctionName: "Z09CSFIDOCLIST",
    },
    ["PRM-137"]: {
      FunctionName: "Z09CSCONSIGNSTOCK",
    },
    ["PRM-138"]: {
      FunctionName: "Z09CSCONSIGNDETAIL",
    },
    ["PRM-139"]: {
      FunctionName: "Z09CSREADLESSOR",
    },
    ["PRM-140"]: {
      FunctionName: "Z09CSB2BLISTVEHICLE",
    },
    ["PRM-141"]: {
      FunctionName: "Z09CSREADMILE",
    },
    ["PRM-142"]: {
      FunctionName: "Z09CSB2BDISPATCH",
    },
    ["PRM-143"]: {
      DbTable: "TBSAP201",
    },
    ["PRM-144"]: {
      FunctionName: "Z09CSB2BLIST",
    },
    ["PRM-145"]: {
      FunctionName: "Z09CSB2BDETAIL",
    },
    ["PRM-147"]: {
      FunctionName: "Z09CSB2BFIDOCLIST",
    },
    ["PRM-148"]: {
      FunctionName: "Z09CSSAVEB2B",
    },
    ["PRM-149"]: {
      FunctionName: "Z09CSLEASEFIDOCLIST",
    },
    ["PRM-150"]: {
      FunctionName: "Z09CSB2BPAYMENT",
    },
    ["PRM-151"]: {
      FunctionName: "Z09CSGETGONG",
    },
    ["PRM-152"]: {
      FunctionName: "Z09CSREADCUSDATA01",
    },
    ["PRM-001"]: {
      FunctionName: "ZPRM_GET_BIKE_PRODUCT_LIST",
    },
    ["PRM-002"]: {
      FunctionName: "ZPRM_SET_ORDER_CREATE_BIKE",
    },
    ["PRM-003"]: {
      FunctionName: "ZPRM_GET_PART_LIST",
    },
    ["PRM-004"]: {
      FunctionName: "ZPRM_SET_ORDER_CREATE_PART",
    },
    ["PRM-005"]: {
      FunctionName: "ZPRM_GET_GIJONG_LIST",
    },
    ["PRM-006"]: {
      FunctionName: "ZPRM_SET_ORDER_TEMPSAVE_PART",
    },
    ["PRM-007"]: {
      FunctionName: "ZPRM_GET_ORDER_TEMPSAVE_PART",
    },
    ["PRM-008"]: {
      FunctionName: "ZPRM_GET_BIKE_ORDER_LIST",
    },
    ["PRM-009"]: {
      FunctionName: "ZPRM_GET_PART_ORDER_LIST",
    },
    ["PRM-010"]: {
      FunctionName: "ZPRM_GET_GIJONG_LIST",
    },
    ["PRM-011"]: {
      FunctionName: "ZPRM_GET_CREDITINFO",
    },
    ["PRM-012"]: {
      FunctionName: "ZPRM_PRE_CHECK",
    },
    ["PRM-013"]: {
      FunctionName: "ZPRM_PRODH_SEARCH",
    },
    ["PRM-014"]: {
      FunctionName: "ZPRM_GET_BIKE_HISTORY_LIST",
    },
    ["PRM-015"]: {
      FunctionName: "ZPRM_AVAILABILITY_CHECK",
    },
    ["PRM-016"]: {
      FunctionName: "ZPRM_GET_BIKE_RE_ORDER_LIST",
    },
    ["PRM-017"]: {
      FunctionName: "ZPRM_GET_PART_ORDER_UNOU_LIST",
    },
    ["PRM-019"]: {
      FunctionName: "ZPRM_GET_ZMATNR_LIST",
    },
    ["PRM-020"]: {
      FunctionName: "ZPRM_GET_PARCO_LIST",
    },
    ["PRM-023"]: {
      FunctionName: "ZPRM_GET_PART_ORDER_PRE_LIST",
    },
    ["PRM-024"]: {
      FunctionName: "ZPRM_GET_PREORD_TEMPSAVE_PART",
    },
    ["PRM-028"]: {
      FunctionName: "ZPRM_GET_PART_SALES_DETAIL",
    },
    ["PRM-030"]: {
      FunctionName: "ZPRM_SET_PREORD_TEMPSAVE_PART",
    },
    ["PRM-031"]: {
      FunctionName: "ZPRM_GET_PART_RE_ORDER_LIST",
    },
    ["PRM-033"]: {
      FunctionName: "ZPRM_SET_PREORDER_CREATE_PART",
    },
    ["PRM-039"]: {
      FunctionName: "ZPRM_GET_MATNR_STOCK_LIST",
    },
    ["PRM-040"]: {
      FunctionName: "ZPRM_GET_MATNR_LIST",
    },
    ["PRM-042"]: {
      FunctionName: "ZPRM_GET_PRODUCT_CODE_LIST",
    },
    ["PRM-043"]: {
      FunctionName: "ZPRM_GET_PRODUCT_TYPE_LIST",
    },
    ["PRM-044"]: {
      FunctionName: "ZPRM_GET_CARNO_SALES",
    },
    ["PRM-045"]: {
      FunctionName: "ZPRM_GET_ORDER_PLAN",
    },
    ["PRM-046"]: {
      FunctionName: "ZPRM_CUSTOMER_CHANGE",
    },
    ["PRM-047"]: {
      FunctionName: "ZPRM_CONS_AGENCY_LIST",
    },
    ["PRM-050"]: {
      FunctionName: "ZPRM_GET_SALES_LIST",
    },
    ["PRM-051"]: {
      FunctionName: "ZPRM_GET_SALES_CUST",
    },
    ["PRM-052"]: {
      FunctionName: "ZPRM_GET_SALES_GIJONG",
    },
    ["PRM-054"]: {
      FunctionName: "ZPRM_SET_INBOUND",
    },
    ["PRM-055"]: {
      FunctionName: "ZPRM_SET_INOUTBOUND_CANCLE",
    },
    ["PRM-056"]: {
      FunctionName: "ZPRM_GET_INBOUND_LIST",
    },
    ["PRM-057"]: {
      FunctionName: "ZPRM_GET_INOUT_STOCK_LIST",
    },
    ["PRM-058"]: {
      FunctionName: "ZPRM_GET_ENTRUST_STOCK_SUM",
    },
    ["PRM-059"]: {
      FunctionName: "ZPRM_GET_DELIJUM_STOCK_LIST",
    },
    ["PRM-060"]: {
      FunctionName: "ZPRM_GET_STOCK_STATE_LIST",
    },
    ["PRM-061"]: {
      FunctionName: "ZPRM_SET_OUTBOUND",
    },
    ["PRM-062"]: {
      FunctionName: "ZPRM_GET_STOCK_STATE_SUM",
    },
    ["PRM-063"]: {
      FunctionName: "ZPRM_GET_CUST_INFO",
    },
    ["PRM-067"]: {
      FunctionName: "ZPRM_CREAT_RECEIPT",
    },
    ["PRM-068"]: {
      FunctionName: "ZPRM_GET_SALES_GIJONG_DETAIL",
    },
    ["PRM-069"]: {
      FunctionName: "ZPRM_GET_ENTRUST_STOCK_DETAIL",
    },
    ["PRM-070"]: {
      FunctionName: "ZPRM_GET_ENTRUST_STOCK_LIST",
    },
    ["PRM-072"]: {
      FunctionName: "ZPRM_GET_STOCK_STATE_DETAIL1",
    },
    ["PRM-073"]: {
      FunctionName: "ZPRM_CREATE_BIKE_SALES",
    },
    ["PRM-077"]: {
      FunctionName: "ZPRM_CREAT_FORM",
    },
    ["PRM-078"]: {
      FunctionName: "ZPRM_NET_PRICE_SELECT",
    },
    ["PRM-081"]: {
      FunctionName: "ZPRM_CANCEL_SALES_DATA",
    },
    ["PRM-086"]: {
      FunctionName: "ZPRM_GET_ORDER_UPDATE_DETAIL",
    },
    ["PRM-089"]: {
      FunctionName: "ZPRM_GET_BIKE_SALES_DETAIL",
    },
    ["PRM-090"]: {
      FunctionName: "ZPRM_BIKE_SALES_LIST_ADD",
    },
    ["PRM-091"]: {
      FunctionName: "ZPRM_GET_KUNWE_CODE_LIST",
    },
    ["PRM-092"]: {
      FunctionName: "ZPRM_GET_BOARD_LIST",
    },
    ["PRM-093"]: {
      FunctionName: "ZPRM_GET_URL_CREATE",
    },
    ["PRM-094"]: {
      FunctionName: "ZPRM_GET_PUBLIC_GIJONG",
    },
    ["PRM-095"]: {
      FunctionName: "ZPRM_ADD_CHANGE_KUNWE",
    },
    ["PRM-096"]: {
      FunctionName: "ZPRM_CHECK_KUNWE_STCD2",
    },
    ["PRM-097"]: {
      FunctionName: "ZPRM_DELETE_KUNWE",
    },
    ["PRM-099"]: {
      FunctionName: "ZPRM_GET_PART_LIST_MASS",
    },
    ["PRM-100"]: {
      FunctionName: "ZPRM_DELETE_TEMPSAVE_PART",
    },
    ["PRM-401"]: {
      FunctionName: "ZPRM_GET_SALES_LIST_DETAIL",
    },
    ["PRM-402"]: {
      FunctionName: "ZPRM_GET_BOARD_LIST_DETAIL",
    },
    ["PRM-403"]: {
      FunctionName: "ZPRM_GET_PROPOSAL_LIST_DETAIL",
    },
    ["PRM-404"]: {
      FunctionName: "ZPRM_CUSTOMER_CHANGE_INITIAL",
    },
    ["PRM-405"]: {
      FunctionName: "ZPRM_GET_DELIJUM_CODE_LIST",
    },
    ["PRM-406"]: {
      FunctionName: "ZPRM_SET_WEBLOG_KNA1",
    },
    ["PRM-407"]: {
      FunctionName: "ZPRM_GET_EDUCATION_LIST",
    },
    ["PRM-408"]: {
      FunctionName: "ZPRM_GET_EDUCATION_LIST_DETAIL",
    },
    ["PRM-409"]: {
      FunctionName: "ZPRM_GET_PROPOSAL_LIST",
    },
    ["PRM-410"]: {
      FunctionName: "ZPRM_GET_QUALIYT_LIST_DETAIL",
    },
    ["PRM-411"]: {
      FunctionName: "ZPRM_GET_QUALIYT_EN_LIST",
    },
    ["PRM-412"]: {
      FunctionName: "ZPRM_SET_PROPOSAL_LIST",
    },
    ["PRM-413"]: {
      FunctionName: "ZPRM_PSW_GET_INITIAL",
    },
    ["PRM-414"]: {
      FunctionName: "ZPRM_GET_LFA1_T",
    },
    ["PRM-415"]: {
      FunctionName: "ZPRM_SET_LFA1_T",
    },
    ["PRM-416"]: {
      FunctionName: "ZPRM_SET_CARNO_SALES",
    },
    ["PRM-417"]: {
      FunctionName: "ZPRM_SET_PROPOSAL_TASKS",
    },
    ["PRM-418"]: {
      FunctionName: "ZPRM_CONFIRM_SALES_LIST",
    },
    ["PRM-419"]: {
      FunctionName: "ZPRM_GET_LFA1_T_DETAIL",
    },
    ["PRM-420"]: {
      FunctionName: "ZPRM_GET_MAIN_LIST",
    },
    ["PRM-421"]: {
      FunctionName: "ZPRM_GET_BOARD_LIST_FILE",
    },
    ["PRM-422"]: {
      FunctionName: "ZPRM_GET_EDUCATION_LIST_FILE",
    },
    ["PRM-423"]: {
      FunctionName: "ZPRM_GET_PROPOSAL_LIST_FILE",
    },
    ["PRM-424"]: {
      FunctionName: "ZPRM_GET_QUALIYT_LIST_FILE",
    },
    ["IF_RM001"]: {
      DbTable: "TBSAP001",
    },
    ["IF_RM002"]: {
      DbTable: "TBSAP002",
    },
    ["IF_RM003"]: {
      DbTable: "TBSAP003",
    },
    ["IF_RM004"]: {
      DbTable: "TBSAP004",
    },
    ["IF_RM005"]: {
      DbTable: "TBSAP005",
    },
    ["IF_RM006"]: {
      DbTable: "TBSAP006",
    },
    ["IF_RM008"]: {
      DbTable: "TBSAP008",
    },
    ["IF_RM009"]: {
      DbTable: "TBSAP009",
    },
    ["IF_RM011"]: {
      DbTable: "TBSAP011",
    },
    ["IF_RM012"]: {
      DbTable: "TBSAP012",
    },
    ["IF_RM013"]: {
      DbTable: "TBSAP013",
    },
    ["IF_RM014"]: {
      DbTable: "TBSAP014",
    },
    ["IF_RM201"]: {
      DbTable: "TBC70003",
    },
    ["IF_RM202"]: {
      DbTable: "SP_CM_7001",
    },
    ["IF_GW001"]: {
      FunctionName: "ZFI_IF_GW_010",
    },
    ["IF_GW002"]: {
      FunctionName: "ZFI_IF_GW_020",
    },
    ["IF_GW003"]: {
      DbTable: "orgdept",
    },
    ["IF_GW004"]: {
      DbTable: "orgjobposition",
    },
    ["IF_GW005"]: {
      DbTable: "orgjobtitle",
    },
    ["IF_GW006"]: {
      DbTable: "orgperson",
    },
    ["IF_GW007"]: {
      DbTable: "orgaddjob",
    },
    ["IF_HR001"]: {
      FunctionName: "ZFI_IF_SALARY_POST",
    },
    ["IF_HR002"]: {
      FunctionName: "ZFI_IF_SALARY_CANCEL",
    },
    ["IF_HR003"]: {
      FunctionName: "ZFI_IF_CREATE_BP",
    },
    ["IF_HR004"]: {
      DbTable: "PW_IF_COST_CENTER_T",
    },
    ["IF_HR005"]: {
      DbTable: "PW_IF_SIGN_GW_T",
    },
    ["IF_HR006"]: {
      DbTable: "PW_IF_EDUTRIP_GW_T",
    },
    ["IF_PR001"]: {
      FunctionName: "ZFI_IF_PRM_AR_REPORT",
    },
    ["IF_PR002"]: {
      FunctionName: "ZFI_IF_PRM_WT_RECEIPT",
    },
    ["IF_PR003"]: {
      FunctionName: "ZFI_IF_PRM_PAYMENT_REPORT",
    },
    ["IF_PR004"]: {
      FunctionName: "ZFI_IF_PRM_EXPIRE_REPORT",
    },
    ["IF_PR005"]: {
      FunctionName: "ZFI_IF_PRM_DI_REPORT",
    },
    ["IF_PR006"]: {
      FunctionName: "ZFI_IF_PRM_SEARCH_MAT",
    },
    ["CO-001"]: {
      DbTable: "TBSAP101",
    },
    ["CO-002"]: {
      FunctionName: "ZCO_GW_BUDGET_REQUEST",
    },
    ["CO-003"]: {
      FunctionName: "ZCO_GW_BUDGET_DATA",
    },
    ["CO-004"]: {
      FunctionName: "ZCO_GW_KOSTL_SEND",
    },
    ["CO-005"]: {
      FunctionName: "ZCO_GW_KSTAR_SEND",
    },
    ["CO-006"]: {
      FunctionName: "ZCO_GW_BUDGET_STATUS",
    },
    ["CO-007"]: {
      DbTable: "VXSAP001,VXSAP002,VXSAP003",
    },
    ["IF_CA001"]: {
      FunctionName: "ZFI_IF_CA_TRIAL_BALANCE",
    },
    ["IF_CA002"]: {
      FunctionName: "ZFI_IF_CA_SALES",
    },
    ["IF_CA003"]: {
      FunctionName: "ZFI_IF_CA_PURCHASE",
    },
    ["IF_CA004"]: {
      FunctionName: "ZFI_IF_CA_REVENUE",
    },
    ["IF_CA005"]: {
      FunctionName: "ZFI_IF_CA_EXPENSE",
    },
    ["IF_CA006"]: {
      FunctionName: "ZFI_IF_CA_AR",
    },
    ["IF_CA007"]: {
      FunctionName: "ZFI_IF_CA_AP",
    },
    ["IF_CA008"]: {
      FunctionName: "ZFI_IF_CA_ASSET",
    },
    ["PRM-501"]: {
      Type: "IHUB",
      Name: "CREATE_USER",
    },
    ["PRM-502"]: {
      Type: "IHUB",
      Name: "UPDATE_USER",
    },
    ["PRM-503"]: {
      Type: "IHUB",
      Name: "INIT_PASSWORD",
    },
    ["PRM-504"]: {
      Type: "IHUB",
      Name: "BLOCK_USER",
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
