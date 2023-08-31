module.exports = async (draft, { request, rfc }) => {
  const rfcName = draft.json.ifObj.RfcName || request.body.Function.Name;
  if (!rfcName) {
    draft.response.body = {
      errorMessage: "RFC Name does not exist",
    };
    draft.json.terminateFlow = true;
    return;
  }

  const result = await rfc.invoke(
    rfcName,
    draft.json.newData,
    draft.json.rfcConnection,
    { version: "750" }
  );

  if (result.body && result.body.result === undefined) {
    draft.response.body = result.body;
    draft.json.terminateFlow = true;
    // } else if (
    //   !result.body.result.E_STATUS ||
    //   result.body.result.E_MESSAGE === undefined
    // ) {
    //   draft.response.body = {
    //     E_STATUS: "E",
    //     E_MESSAGE: "RFC 결과에 E_STATUS(필수), E_MESSAGE(옵션)가 없습니다",
    //   };
  } else {
    draft.response.body = result.body.result;
  }
};
