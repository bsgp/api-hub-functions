module.exports = async (draft, { request }) => {
  const params = request.params;
  draft.response.body = {};

  draft.response.body = {
    ...draft.response.body,
    params,
  };
};
