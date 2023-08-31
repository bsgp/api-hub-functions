module.exports = async (draft, { rfc, file, env }) => {
  const rfcFn = draft.json.rfcFn;
  const params = draft.json.params;

  const fnName = "BBP_VENDOR_GETLIST";
  if (rfcFn !== fnName) {
    return;
  }
  const COMP_CODE = params.RFC_COMP_CODE || env.RFC_COMP_CODE;
  let result;
  try {
    const rfcIF = {
      ashost: env.RFC_ASHOST,
      client: env.RFC_CLIENT,
      user: env.RFC_USER,
      passwd: env.RFC_PASSWORD,
      lang: "en",
    };
    const filter = { COMP_CODE };
    const opt = { version: "750" };

    const rfcResult = await rfc.invoke(fnName, filter, rfcIF, opt);

    if (rfcResult.statusCode !== 200) {
      throw new Error("RFC Call statusCode error");
    }
    draft.response.body.origin = rfcResult;
    const rfcData = rfcResult.body.result;
    result = {
      ...rfcData,
      VENDOR_ID: "",
      VENDOR_TEXT: "",
      VENDOR_NUMBER: "",
      COMPANY_ID: "",
      BUSSINESS_TYPE: "",
      INDUSTRY_TYPE: "",
      PRESIDENT: "",
      COUNTRY_CODE: "",
      REGION_TEXT: "",
      ADDRESS1: "",
      ADDRESS2: "",
      POSTAL_CODE: "",
      TEL: "",
      MOBILE: "",
      EMAIL: "",
    };

    const uploadFileName = `/srm/test/result.js`;
    await file.upload(uploadFileName, result, { gzip: true });
  } catch (error) {
    const uploadFileName = `/srm/test/error.js`;
    await file.upload(uploadFileName, error.message, { gzip: true });
    throw error;
  }

  draft.response.body[fnName] = result;
  draft.response.body.E_STATUS = "S";
};
