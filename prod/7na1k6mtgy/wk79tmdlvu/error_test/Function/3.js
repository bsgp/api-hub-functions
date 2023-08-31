module.exports = async (draft, { request }) => {
  // your script
  draft.response.body = { request, message: "succeed sending error message" };
  draft.response.statusCode = 504;
};
