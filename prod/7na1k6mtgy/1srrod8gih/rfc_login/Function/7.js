module.exports = async (draft, { tryit, request }) => {
  const errorMessage = tryit(() =>
    [draft.json.authResult.body.key, draft.json.authResult.body.errorMessage]
      .filter(Boolean)
      .join(", ")
  );
  draft.response.body.authenticated = !errorMessage;
  draft.response.body.errorMessage = errorMessage;
  if (draft.json.authResult.body.key === "WRONG_PASSWORD") {
    draft.response.body.errorMessage = "정확한 비밀번호를 입력해주세요";
  }

  // if (errorMessage) {
  draft.json.lock = {
    params: {
      USER_NAME: request.body.UserId,
    },
  };
  // } else {
  draft.json.terminateFlow = true;
  return;
  // }
};
