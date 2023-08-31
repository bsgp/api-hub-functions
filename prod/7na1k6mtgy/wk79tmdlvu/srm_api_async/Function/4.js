module.exports = async (draft, { request }) => {
  const params = request.body;
  draft.json.params = params;

  if (params.resultUploadKey) {
    draft.json.resultUploadKey = params.resultUploadKey;
    draft.json.nextNodeKey = "Function#5";
  } else if (params.flowID) {
    const resultUploadKey = getKey(params.flowID);
    draft.json = {
      ...draft.json,
      ...request.body,
      resultUploadKey,
      flowID: request.body.flowID,
    };

    /**
     * SET qualifier
     * 운영에 반영된 api를 수정하면 전체가 반영되므로 stage !=="dev" 인경우
     * stableList에 qualifier가 세팅되어 있으면
     * flow version | alias를 해당 stableList에 qualifier로 사용되도록 설정
     */
    const fQualifier = stableList.find(
      (item) => item.id === request.body.flowID
    );
    const qualifier = fQualifier ? fQualifier.qualifier : "latest";
    if (request.stage !== "dev") {
      draft.json.qualifier = qualifier;
    } else {
      draft.json.qualifier = "latest";
    }

    draft.json.nextNodeKey = "Flow#3";
    draft.response.body = { resultUploadKey, request, qualifier };
  } else {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "Invalid Request",
      request,
    };
    draft.json.nextNodeKey = "Function#6";
  }

  function getKey(flowID) {
    const [year, month, date] = request.requestTime;
    const resultUploadKey = [
      "byd/data",
      flowID,
      year,
      month,
      date,
      request.headers["bsg-support-user-id"],
      new Date().valueOf().toString().substr(6),
    ].join("/");
    return resultUploadKey;
  }
};

const stableList = [];
