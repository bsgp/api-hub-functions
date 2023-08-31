module.exports = async (draft, { request }) => {
  const params = request.body;
  draft.json.params = params;
  draft.json.resultUploadKey = request.body && request.body.resultUploadKey;

  draft.response.body = { reqParmas: params };
};
