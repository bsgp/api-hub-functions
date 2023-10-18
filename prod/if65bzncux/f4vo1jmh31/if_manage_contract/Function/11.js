module.exports = async (draft, { request }) => {
  // your script
  draft.response.body = {
    request,
    E_STATUS: "F",
    E_MESSAGE: `TEST`,
  };
};
