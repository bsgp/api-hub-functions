module.exports = async (draft, { request, env }) => {
  // settings
  draft.json.username = env.BYD_ID;
  draft.json.password = env.BYD_PASSWORD;
  draft.json.url = [
    `https://${env.BYD_URL}`,
    "/sap/byd/odata/ana_businessanalytics_analytics.svc",
    "/RPSCMINVV02_Q0001QueryResults",
  ].join("");

  /** async 처리 시 draft.json을 받아오지 않음
   *  request body로 resultUploadKey를 넘기는 것으로 대체
   */
  // if (draft.json.resultUploadKey) {
  //   // draft.json.params =  flow:srm_api_async draft.json.params;
  // } else {
  // }
  draft.json.params = request.params;
  draft.json.resultUploadKey = request.body && request.body.resultUploadKey;
};
