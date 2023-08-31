module.exports = async (draft, { request }) => {
  draft.json.dbName = ["kyungshin", request.stage].join("_");
};
