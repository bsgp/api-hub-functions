module.exports = async (draft) => {
  const response = {
    message: "test Message",
  };
  draft.response.body = response;
};
