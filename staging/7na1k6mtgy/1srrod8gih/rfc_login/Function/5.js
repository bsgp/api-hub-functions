module.exports = async (draft, { tryit, request }) => {
  draft.response.body.fullName = tryit(
    () => draft.response.body.result.ADDRESS.FULLNAME,
    null
  );
  draft.response.body.errorMessage = tryit(() =>
    draft.response.body.result.RETURN.filter(({ TYPE }) => TYPE === "E")
      .map((each) => each.MESSAGE || `Message ${each.ID}(${each.NUMBER})`)
      .join(";")
  );
  delete draft.response.body.result;

  if (draft.response.body.errorMessage) {
    draft.json.terminateFlow = true;
    return;
  }

  draft.json.auth = {
    params: {
      BNAME: "9000",
      PASSWORD: request.body.Password, // "Q1qaz2wsx!",
    },
  };
};
