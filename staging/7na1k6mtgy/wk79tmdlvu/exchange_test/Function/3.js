module.exports = async (draft, { request }) => {
  // your script
  draft.response.body = { body: "latest test", request };
};
