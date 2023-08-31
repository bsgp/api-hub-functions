module.exports = async (draft, { request }) => {
  draft.json.dbName = ["dddm", request.stage].join("_");
};
