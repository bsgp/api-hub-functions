module.exports = async (draft, { request }) => {
  // your script
  draft.response.body = { uuid: request.body.uuid, data: "none data" };
};
