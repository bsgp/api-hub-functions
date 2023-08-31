module.exports = async (draft, { request }) => {
  if (request.method !== "GET") {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: `Failed: Wrong Request method`,
    };
    return;
  }
  draft.response.body = { request };
};
