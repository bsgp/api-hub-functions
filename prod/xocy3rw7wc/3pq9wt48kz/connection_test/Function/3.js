module.exports = async (draft) => {
  draft.response.body = {
    result: {
      E_STATUS: "S",
      E_MESSAGE: "성공",
    },
  };
};
