module.exports = async (draft, context) => {
  // your script
  const key = Object.keys(context);

  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "Get User List Successfully.",
    key,
    user: context.user,
  };
};
