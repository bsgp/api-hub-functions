module.exports = async (draft, { file }) => {
  const tables = {
    sample: {
      name: "SAMPLE_0",
      desc: "Spark sample DB",
    },
    test: {
      name: "test_0",
      desc: "Spark test DB",
    },
  };

  const tableConfig = await file.upload("config/tables.json", tables, {
    gzip: true,
  });

  draft.json.tables = tables;
  draft.response.body = { tableConfig };
};
