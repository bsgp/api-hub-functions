module.exports = async (draft, { odata }) => {
  const username = draft.json.username;
  const password = draft.json.password;
  const odataService = draft.json.odataService;

  const queryParameters = [
    "$inlinecount=allpages",
    "$top=999",
    "$select=InternalID,BusinessPartnerFormattedName",
    "$format=json",
  ];

  const queryString = queryParameters.join("&");

  const odataURL = [odataService, queryString].join("?");

  const spData = await odata.get({
    url: odataURL,
    username,
    password,
  });
  if (spData.ResponseError || spData.Exception) {
    draft.json.isFailed = true;
    draft.response.body = { odataURL, ...spData };
  } else {
    const __count = Number(spData.d.__count);
    const supplier = spData.d.results;
    const conversion = supplier.map((sp) => ({
      id: sp.InternalID,
      text: sp.BusinessPartnerFormattedName,
    }));
    draft.response.body = {
      odataURL,
      conversion,
      __count,
      E_STATUS: "S",
      E_MESSAGE: "공급업체 조회가 완료되었습니다.",
    };
  }
};
