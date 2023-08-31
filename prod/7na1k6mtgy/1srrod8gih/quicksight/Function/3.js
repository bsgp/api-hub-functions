module.exports = async (draft, { quicksight, request, flow }) => {
  const { dashboardAlias, embedType, doNotAddParamsToUrl, sessionId } =
    request.body;

  let sesData;
  if (sessionId) {
    sesData = await flow.run({
      id: "directory_v2",
      method: "GET",
      body: {
        object: "user",
        getSession: {
          id: sessionId,
        },
      },
    });
    // console.log("sesData:", sesData);
    if (sesData.errorMessage) {
      draft.response.body = sesData;
      return;
    }
  }

  const result = await quicksight.getEmbedUrl(dashboardAlias, embedType, {
    doNotAddParamsToUrl,
    sessionData: sesData && sesData.result,
  });

  draft.response.body = result;
};
