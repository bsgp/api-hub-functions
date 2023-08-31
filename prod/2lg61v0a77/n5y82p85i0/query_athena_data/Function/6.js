module.exports = async (draft, { request }) => {
  if (request.body.QueryId) {
    draft.json.nextNodeKey = "Function#4";
    draft.response.body.queryId = request.body.QueryId;
  } else {
    draft.json.nextNodeKey = "Function#3";
  }
};
