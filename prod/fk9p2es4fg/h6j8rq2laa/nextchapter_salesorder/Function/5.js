module.exports = async (draft) => {
  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "N.C Data pause",
  };
};
