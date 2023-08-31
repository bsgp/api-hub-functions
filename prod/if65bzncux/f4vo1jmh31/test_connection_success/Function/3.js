module.exports = async (draft) => {
  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "연결 성공",
  };
};
