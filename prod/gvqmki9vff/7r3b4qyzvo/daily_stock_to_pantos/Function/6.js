module.exports = async (draft, { log }) => {
  draft.pipe.json.isTest = false;
  log("start");
  draft.response.body = [];
};
