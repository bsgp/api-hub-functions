module.exports = async (draft) => {
  draft.response.body = draft.json.ds;
};
