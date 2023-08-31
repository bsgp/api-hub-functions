module.exports = async (draft, { file, log }) => {
  const tables = {
    Invoice: {
      name: "Invoice_2",
      desc: "Invoice DB",
    },
  };

  const uploadConfig = await file.upload("config/tables.json", tables, {
    gzip: true,
  });
  log("upload tables config:", uploadConfig);

  draft.pipe.json.tables = tables;
  draft.response.body = {};
};
