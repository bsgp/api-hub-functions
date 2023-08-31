module.exports = async (draft, { request }) => {
  const { resultUploadKey, ...args } = request.body || {};
  draft.json.params = { ...args };
  draft.json.resultUploadKey = resultUploadKey;
  draft.response.body = {
    // request,
  };
};
