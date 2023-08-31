module.exports = async (draft, { request }) => {
  const params = request.body;
  draft.json.rfcFn = params.RFC;
  draft.json.params = params;
  draft.response.body = { params };
};
