const crypto = require("crypto");

module.exports = async (draft, { request, rfc, clone, kst }) => {
  const rfcName = draft.json.ifObj.RfcName || request.body.Function.Name;
  if (!rfcName) {
    draft.response.body = {
      errorMessage: "RFC Name does not exist",
    };
    draft.json.terminateFlow = true;
    return;
  }

  const rfcReqData = clone(request.body.Data);
  rfcReqData.IS_HEADER = {
    IFID: request.body.InterfaceId,
    IFTRACKINGID: crypto.randomUUID(),
    IFDATE: kst.format("YYYYMMDD"),
    IFTIME: kst.format("HHmmss"),
  };

  const result = await rfc.invoke(
    rfcName,
    rfcReqData,
    draft.json.rfcConnection,
    { version: "750" }
  );

  if (result.body.errorMessage && result.body.key === "RFC_INVALID_PARAMETER") {
    draft.response.body = {
      E_STATUS: "E",
      E_MESSAGE: `${result.body.key}: ${result.body.errorMessage}`,
    };
  } else if (result.body.result === undefined) {
    if (result.statusCode) {
      draft.response = result;
    } else {
      draft.response.body = result;
    }
    draft.json.terminateFlow = true;
  } else if (
    !result.body.result.E_STATUS ||
    result.body.result.E_MESSAGE === undefined
  ) {
    draft.json.rfcResult = result;
    draft.response.body = {
      E_STATUS: "E",
      E_MESSAGE: "RFC 결과에 E_STATUS, E_MESSAGE가 없습니다, RFC를 수정하세요",
    };
  } else {
    switch (request.body.InterfaceId) {
      default: {
        draft.response.body = result.body.result;
        break;
      }
    }
  }
};
