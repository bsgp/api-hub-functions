module.exports = async (draft, { request }) => {
  // your script
  if (request.body.uuid) {
    draft.json.nextNodeKey = "Function#5";
  }
  draft.json.nextNodeKey = "Function#3";
};
