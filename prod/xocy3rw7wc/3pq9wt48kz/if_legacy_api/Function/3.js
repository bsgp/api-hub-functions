module.exports = async (draft, { request, restApi, lib }) => {
  const { isObject } = lib;

  draft.json.queryString = "";
  draft.json.reqBody = "";

  if (draft.json.ifObj.BodyToQueryString === false) {
    draft.json.reqBody = JSON.stringify(request.body.Data);
  } else {
    const params = new URLSearchParams();
    Object.keys(request.body.Data).forEach((key) => {
      params.set(key, request.body.Data[key]);
    });
    // params.set("I_BUKRS", "2000");
    // params.set("I_DATE_FROM", "20220901");
    // params.set("I_DATE_TO", "20220930");
    // params.set("I_DCTYP", "BZM02");

    draft.json.queryString = params.toString();
  }

  if (draft.json.ifObj === undefined) {
    draft.response.body = {
      errorMessage: "인터페이스 오브젝트를 취득하지 못했습니다.",
    };
    draft.response.statusCode = 500;
    draft.json.terminateFlow = true;
    return;
  }

  draft.json.url = draft.json.ifObj.Url;
  draft.json.httpMethod = draft.json.ifObj.HttpMethod || "POST";
  draft.json.httpHeaders = draft.json.ifObj.HttpHeaders || {};

  const fullUrl = [
    // "http://bizmall.qa.golfzon.com/gz/erp/iffibzm.do",
    draft.json.url,
    draft.json.queryString,
  ]
    .filter(Boolean)
    .join("?");

  const result = await restApi[draft.json.httpMethod.toLowerCase()]({
    url: fullUrl,
    headers: draft.json.httpHeaders,
    body: draft.json.reqBody,
  });

  draft.response.statusCode = result.statusCode;
  if (result.statusCode !== 200) {
    draft.response.body = {
      errorFromLegacy: true,
      requestUrl: fullUrl,
      response: {
        headers: result.headers,
        body: result.body,
        statusCode: result.statusCode,
      },
      requestBody: draft.json.reqBody,
    };
  } else {
    draft.response.body = result.body;
  }

  if (request.body.ShowFullUrl === true) {
    if (isObject(result.body)) {
      draft.response.body.fullUrl = fullUrl;
    }
  }
};
