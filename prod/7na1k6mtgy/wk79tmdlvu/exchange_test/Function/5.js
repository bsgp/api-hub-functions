module.exports = async (draft, { file }) => {
  const result = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });
  draft.pipe.json.table = result.log.name;
};
