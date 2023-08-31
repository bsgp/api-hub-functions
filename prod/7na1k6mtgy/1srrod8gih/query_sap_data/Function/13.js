module.exports = async (draft, { request }) => {
  if (request.body.uuid) {
    draft.json.nextNodeKey = "Function#14";
  } else {
    draft.json.nextNodeKey = "Function#12";
  }
};
