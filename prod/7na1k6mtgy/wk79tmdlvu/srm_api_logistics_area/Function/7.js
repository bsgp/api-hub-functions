module.exports = async (draft, { odata, file }) => {
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
    const siteList = [];
    const logisticsAreaList = [];

    const conversion = area.reduce((list, lArea) => {
      if (!siteList.find((site) => site.key === lArea.SiteID)) {
        siteList.push({
          key: lArea.SiteID,
          text: lArea.SiteName || lArea.SiteID,
        });
      }
      if (!logisticsAreaList.find((logi) => logi.key === lArea.ID)) {
        logisticsAreaList.push({
          key: lArea.ID,
          text: [lArea.ID, lArea.Description].filter(Boolean).join(" / "),
        });
      }
      list.push({
        siteID: lArea.SiteID,
        siteText: lArea.SiteName || lArea.SiteID,
        logisticsID: lArea.ID,
        id: [lArea.SiteID, lArea.ID].filter(Boolean).join("/"),
        text: lArea.Description || lArea.ID,
      });
      return list;
    }, []);

    const sortFn = function (a, b) {
      var keyA = a.key.toUpperCase();
      var keyB = b.key.toUpperCase();
      if (keyA < keyB) {
        return -1;
      } else if (keyA > keyB) {
        return 1;
      } else return 0;
    };

    siteList.sort(sortFn);
    logisticsAreaList.sort(sortFn);

    draft.response.body = {
      odataURL,
      defaultSiteID: draft.json.defaultSiteID || siteList[0].key,
      siteList,
      logisticsAreaList,
      conversion,
      __count,
      E_STATUS: "S",
      E_MESSAGE: "물류영역 정보를 가져왔습니다",
    };
    const uploadResult = await file.upload(
      draft.json.filePath,
      draft.response.body
    );
    draft.response.body = { ...draft.response.body, uploadResult };
  }
};
