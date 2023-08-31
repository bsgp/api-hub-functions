module.exports = async (draft, context) => {
  // The "immer" package is used
  draft.pipe.json.ff = "ff";
}
