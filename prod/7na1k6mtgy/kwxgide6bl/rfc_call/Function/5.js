module.exports = async (draft, { rfc, file, env }) => {
  // const requestBody = draft.json.requestBody;
  const rfcFn = draft.json.rfcFn;
  const params = draft.json.params;

  const fnName = "BAPI_VENDOR_GETDETAIL";
  if (rfcFn !== fnName) {
    return;
  }

  const { VENDORNO } = params;
  let result;
  try {
    const rfcIF = {
      ashost: env.RFC_ASHOST,
      client: env.RFC_CLIENT,
      user: env.RFC_USER,
      passwd: env.RFC_PASSWORD,
      lang: "en",
    };
    const filter = { COMPANYCODE: env.RFC_COMP_CODE, VENDORNO };
    const opt = { version: "750" };

    const rfcResult = await rfc.invoke(fnName, filter, rfcIF, opt);

    if (rfcResult.statusCode !== 200) {
      throw new Error("RFC Call statusCode error");
    }
    draft.response.body.origin = rfcResult;
    const rfcData = rfcResult.body.result;
    result = {
      VENDOR_ID: rfcData.VENDORNO,
      VENDOR_TEXT: rfcData.GENERALDETAIL.NAME,
      VENDOR_NUMBER: "",
      COMPANY_ID: "",
      BUSSINESS_TYPE: "",
      INDUSTRY_TYPE: "",
      PRESIDENT: "",
      COUNTRY_CODE: rfcData.GENERALDETAIL.COUNTRY,
      REGION_TEXT: rfcData.GENERALDETAIL.CITY,
      ADDRESS1: rfcData.GENERALDETAIL.STREET,
      ADDRESS2: "",
      POSTAL_CODE: rfcData.GENERALDETAIL.POSTL_CODE,
      TEL: rfcData.GENERALDETAIL.TELEPHONE,
      MOBILE: rfcData.GENERALDETAIL.TELEPHONE2,
      EMAIL: "",
    };

    const uploadFileName = `/srm/test/result.js`;
    await file.upload(uploadFileName, result, { gzip: true });
  } catch (error) {
    const uploadFileName = `/srm/test/error.js`;
    await file.upload(uploadFileName, error.message, { gzip: true });
    throw error;
  }

  // draft.response.body = {
  //   ...draft.response.body,
  //   // result,
  //   requestBody,
  // };
  draft.response.body[fnName] = result;
  draft.response.body.E_STATUS = "S";
};
