module.exports = async (draft, { file, log }) => {
  const tables = {
    log: {
      name: "LOG_LG_DM_5",
      desc: "LG DM Transaction log",
    },
  };

  const uploadConfig = await file.upload("config/tables.json", tables, {
    gzip: true,
  });
  log("upload tables config:", uploadConfig);

  draft.pipe.json.tables = tables;
};
