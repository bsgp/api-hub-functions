module.exports = async (draft, { request, rfc, file }) => {
  if (draft.response.body.errorMessage) {
    return;
  }

  // const { tryit } = lib;
  let paramsFileName;
  if (request.body.FileName) {
    paramsFileName = await file.getUrl(request.body.FileName, {
      internal: true,
    });
  }

  const functionName = request.body.FunctionName;
  const parameters = request.body.Parameters;
  // request.sourceIP === "121.165.244.53"
  // {
  //   ...draft.pipe.json.connection,
  //   ashost: "3.37.12.138",
  //   client: "100",
  //   user: "rfc_prm",
  //   passwd: "Init1234567",
  //   codepage: "4103",
  //   // lang: "en",
  // }
  const result = await rfc.invoke(
    functionName,
    parameters,
    draft.pipe.json.connection,
    { version: "750", paramsFileName }
  );
  draft.response = result;
  draft.response.body.stage = draft.pipe.json.newStage;
};
