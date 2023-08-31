module.exports = async (draft, context) => {
  // The "immer" package is used
  draft.response.body.ff = draft.pipe.json.ff;
  draft.response.body.gg = draft.pipe.json.gg;
}
