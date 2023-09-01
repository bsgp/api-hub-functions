module.exports = async (draft, { restApi }) => {
  draft.response.body.result = "";
  restApi.get();
};
