module.exports = async (draft) => {
  if (draft.json.result === undefined) {
    draft.json.result = [];
  }
  draft.json.result.push(draft.response.body);

  draft.response.body = draft.json.result;
};
