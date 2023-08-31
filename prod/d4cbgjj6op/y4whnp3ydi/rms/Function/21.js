module.exports = async (draft, { request }) => {
  // your script
  console.log(request);
  draft.response.body = "f";
};
