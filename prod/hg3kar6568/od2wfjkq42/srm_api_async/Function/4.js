module.exports = async (draft, { request }) => {
  const params = request.params;
  draft.json.params = params;

  if (params.resultUploadKey) {
    draft.json.resultUploadKey = params.resultUploadKey;
    draft.json.nextNodeKey = "Function#5";
  } else if (params.flowID) {
    // GET
    const resultUploadKey = getKey(params.flowID);
    draft.json.resultUploadKey = resultUploadKey;
    draft.json.reqPath = params.endpoint;
    draft.json.flowID = params.flowID;
    draft.json.nextNodeKey = "Flow#3";
    draft.response.body = { resultUploadKey };
  } else if (request.body.flowID) {
    // POST, PATCH
    const resultUploadKey = getKey(request.body.flowID);
    draft.json = {
      ...draft.json,
      ...request.body,
      resultUploadKey,
      flowID: request.body.flowID,
    };
    draft.json.nextNodeKey = "Flow#3";
    draft.response.body = { resultUploadKey, request };
  } else {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Invalid Request",
      request,
    };
    draft.json.nextNodeKey = "Output#2";
  }

  function getKey(flowID) {
    const [year, month, date] = request.requestTime;
    const resultUploadKey = [
      "srm/data",
      flowID,
      year,
      month,
      date,
      request.headers["bsg-support-user-id"],
      new Date().valueOf().toString().substr(7),
    ].join("/");
    return resultUploadKey;
  }
};
