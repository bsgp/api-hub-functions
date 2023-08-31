module.exports = async (draft, { tryit }) => {
  draft.response.body.lockState = tryit(() => draft.json.lockResult.body);
};
