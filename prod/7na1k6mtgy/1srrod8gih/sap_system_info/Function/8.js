module.exports = async (draft) => {
  draft.json.parameters = {
    FUNCNAME: draft.json.functionName,
  };
};
