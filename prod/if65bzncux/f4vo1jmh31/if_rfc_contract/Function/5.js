module.exports = async (draft, { request }) => {
  const whitelist = ["121.165.132.241", "121.133.35.204", "121.133.35.193"];

  if (whitelist.includes(request.sourceIP)) {
    // pass
  } else {
    draft.response.body = {
      errorMessage: "Access is blocked by firewall",
    };
    draft.response.statusCode = 403;
    draft.json.terminateFlow = true;
  }
};
