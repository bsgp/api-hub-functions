module.exports = async (draft, { file, log }) => {
  const tables = {
    confirmationjournal: {
      name: "CONFIRMATION_JOURNAL_01",
      desc: "CNTECH Confirmationjournal DB",
    },
  };

  const uploadConfig = await file.upload("config/tables.json", tables, {
    gzip: true,
  });
  log("upload tables config:", uploadConfig);

  draft.pipe.json.tables = tables;
  draft.response.body = {};
};
