module.exports = async (draft, { request }) => {
  draft.json.dbName = ["dashboard", request.stage].join("_");
};
