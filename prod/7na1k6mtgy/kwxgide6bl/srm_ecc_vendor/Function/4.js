module.exports = async (draft) => {
  const vendor = draft.pipe.json.vendor;
  draft.response.body.vendor = vendor;

  const vendorData = vendor.body.result;
  const emailList = (vendorData.BAPIADSMTP || []).filter(
    (item) => item.STD_NO !== "X"
  );
  const telList = (vendorData.BAPIADTEL || []).filter(
    (item) => item.STD_NO !== "X"
  );

  const TEL = telList.find((item) => item.R_3_USER === "1");
  const MOBILE = telList.find((item) => item.R_3_USER === "");
  const EMAIL = emailList[0] ? emailList[0].E_MAIL : "";
  const conversion = {
    VENDOR_ID: vendorData.BUSINESSPARTNER,
    VENDOR_TEXT: "",
    VENDOR_NUMBER: "",
    COMPANY_ID: "",
    BUSSINESS_TYPE: "",
    INDUSTRY_TYPE: "",
    PRESIDENT: "",
    COUNTRY_CODE: vendorData.ADDRESSDATA.COUNTRY,
    REGION_TEXT: vendorData.ADDRESSDATA.REGION,
    ADDRESS1: vendorData.ADDRESSDATA.CITY,
    ADDRESS2: vendorData.ADDRESSDATA.BUILDING,
    POSTAL_CODE: vendorData.ADDRESSDATA.POSTL_COD1,
    TEL: TEL ? TEL.TELEPHONE : "",
    MOBILE: MOBILE ? MOBILE.TELEPHONE : "",
    EMAIL,
  };

  draft.response.body.conversion = conversion;
  draft.response.body.E_STATUS = "S";
};
