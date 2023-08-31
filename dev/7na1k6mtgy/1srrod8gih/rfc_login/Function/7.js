module.exports = async (draft, { tryit }) => {
  const errorMessage = tryit(() =>
    [draft.json.authResult.body.key, draft.json.authResult.body.errorMessage]
      .filter(Boolean)
      .join(", ")
  );
  draft.response.body.authenticated = !errorMessage;
  draft.response.body.errorMessage = errorMessage;

  // if (errorMessage) {
  draft.json.lock = {
    params: {
      USER_NAME: "9000",
    },
  };
  // } else {
  draft.json.terminateFlow = true;
  return;
  // }
};
