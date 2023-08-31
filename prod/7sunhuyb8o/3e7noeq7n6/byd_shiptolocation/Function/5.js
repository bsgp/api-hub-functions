module.exports = async (draft, { odata, file }) => {
  const username = draft.json.username;
  const password = draft.json.password;
  const odataService = draft.json.odataService;
  const params = draft.json.params;

  const filterArr = [];
  if (params.ID) {
    filterArr.push(`ID eq '${params.ID}'`);
  }
  if (params.Name) {
    filterArr.push(`Name eq '*${params.Name}*'`);
  }
  const filter = filterArr.filter(Boolean).join(" and ");

  const queryParameters = [
    "sap-language=ko",
    "$inlinecount=allpages",
    "$format=json",
  ];
  if (filter) {
    queryParameters.push(`$filter=${filter}`);
  }

  const queryString = queryParameters.join("&");

  const odataURL = [odataService, queryString].join("?");

  const locationData = await odata.get({
    url: odataURL,
    username,
    password,
  });
  if (locationData.ResponseError || locationData.Exception) {
    draft.json.isFailed = true;
    draft.response.body = {
      odataURL,
      username,
      password,
      ...locationData,
    };
  } else {
    const __count = Number(locationData.d.__count);
    const area = locationData.d.results;
    const locationList = [];

    const conversion = area.reduce((list, lArea) => {
      if (!locationList.find((logi) => logi.key === lArea.ID)) {
        locationList.push({
          key: lArea.ID,
          text: [lArea.ID, lArea.Name].filter(Boolean).join(" / "),
        });
      }
      list.push({
        locationID: lArea.ID,
        id: lArea.ID,
        text: lArea.Name || lArea.ID,
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

    locationList.sort(sortFn);

    draft.response.body = {
      odataURL,
      defaultLocationID:
        draft.json.defaultLocationID || (conversion[0] && conversion[0].id),
      locationList,
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
