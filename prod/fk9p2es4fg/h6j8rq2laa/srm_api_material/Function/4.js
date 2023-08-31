module.exports = async (draft, { odata, lib }) => {
  const { tryit, defined } = lib;
  const username = draft.json.username;
  const password = draft.json.password;
  const url = draft.json.url;
  const params = draft.json.params;

  const filterArr = [];
  if (params.InternalID) {
    filterArr.push(`InternalID eq '${params.InternalID}'`);
  }
  if (params.Description) {
    filterArr.push(`Description eq '*${params.Description}*'`);
  }
  const filter = filterArr.filter(Boolean).join(" and ");
  const select = ["InternalID", "Description"].join(",");

  const queryParameters = [
    `$select=${select}`,
    `$filter=${filter}`,
    "$inlinecount=allpages",
    // "$top=30",
  ];
  if (params.skip) {
    queryParameters.push(`$skip=${params.skip}`);
  }
  const queryString = queryParameters.join("&");
  const odataURL = [url, queryString].join("?");
  const odataRes = await odata.get({
    url: odataURL,
    username,
    password,
  });
  const productData = tryit(() => defined(odataRes.d.results, []), []);
  const inlinecount = tryit(() => defined(odataRes.d.__count, 0), 0);
  const isLast =
    Number(params.skip || 0) + productData.length === Number(inlinecount);

  const conversion = productData.map((item) => {
    return { id: item.InternalID, text: item.Description };
  });
  draft.response.body = {
    ...draft.response.body,
    E_STATUS: conversion.length !== 0 ? "S" : "F",
    E_MESSAGE:
      conversion.length !== 0 ? "조회가 완료되었습니다" : "검색결과가 없습니다",
    isLast,
    conversion,
    odataRes,
    odataURL,
  };
};
