module.exports = async (draft, { odata }) => {
  const username = draft.json.username;
  const password = draft.json.password;
  const odataService = draft.json.odataService;
  const params = draft.json.params;

  const filterArr = [];
  if (params.ID) {
    filterArr.push(`ID eq '${params.ID}'`);
  }
  if (params.Description) {
    filterArr.push(`Description eq '*${params.Description}*'`);
  }
  const filter = filterArr.filter(Boolean).join(" and ");

  const queryParameters = ["$inlinecount=allpages", "$format=json"];
  if (filter) {
    queryParameters.push(`$filter=${filter}`);
  }

  const queryString = queryParameters.join("&");

  const odataURL = [odataService, queryString].join("?");

  const areaData = await odata.get({
    url: odataURL,
    username,
    password,
  });
  if (areaData.ResponseError || areaData.Exception) {
    draft.json.isFailed = true;
    draft.response.body = {
      odataURL,
      ...areaData,
    };
  } else {
    const __count = Number(areaData.d.__count);
    const area = areaData.d.results;
    const conversion = area.map((lArea) => ({
      siteID: lArea.SiteID,
      logisticsID: lArea.ID,
      id: [lArea.SiteID, lArea.ID].filter(Boolean).join("/"),
      text: lArea.Description,
    }));
    draft.response.body = {
      odataURL,
      conversion,
      __count,
      E_STATUS: "S",
      E_MESSAGE: "물류영역 정보를 가져왔습니다",
    };
  }
};
