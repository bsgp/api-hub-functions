module.exports = async (draft, { request }) => {
  draft.json.result = request.body;
  draft.response.body = {
    request,
  };
};
