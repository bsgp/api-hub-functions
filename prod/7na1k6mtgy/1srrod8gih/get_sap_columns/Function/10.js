module.exports = async (draft) => {
  const { errorMessage } = draft.response.body;

  if (errorMessage) {
    draft.json.terminateFlow = true;
    return;
  }

  draft.response.body = draft.json.resBody;
};
