module.exports = async (draft, { fn, odata }) => {
  const params = draft.json.params;
  const username = draft.json.username;
  const password = draft.json.password;
  const odataService = draft.json.odataService;

  const queryParameters = [
    "sap-language=ko",
    "$inlinecount=allpages",
    "$top=999",
    "$format=json",
  ];

  if (Object.keys(params).length > 0) {
    if (params.filter) {
      queryParameters.push(`$filter=${params.filter}`);
    }
    if (params.expand) {
      queryParameters.push(`$expand=${params.expand}`);
    }
  } else
    queryParameters.push("$select=InternalID,BusinessPartnerFormattedName");

  const queryString = queryParameters.join("&");
  const odataURL = [odataService, queryString].join("?");

  const getSupplier = await fn.fetchAll(odata, {
    url: odataURL,
    username,
    password,
  });

  const __count = getSupplier.result.length;

  const conversion = getSupplier.result.map(
    ({ InternalID, BusinessPartnerFormattedName, ...args }) => {
      let defaultObj = {
        id: InternalID,
        text: BusinessPartnerFormattedName,
      };
      if (Object.keys(params).length > 0) {
        defaultObj = { ...args, ...defaultObj };
      }
      return defaultObj;
    }
  );
  draft.response.body = {
    odataURL,
    getSupplier,
    conversion,
    __count,
    E_STATUS: "S",
    E_MESSAGE: "공급업체 조회가 완료되었습니다.",
  };
};
