module.exports = async (
  draft
  // , { file, log }
) => {
  const tables = {
    log: {
      name: "EXCHANGE_2",
      desc: "341545 EXCHANGE DB",
    },
  };

  // const uploadConfig = await file.upload("config/tables.json", tables, {
  //   gzip: true,
  // });
  // log("upload tables config:", uploadConfig);

  draft.pipe.json.tables = tables;
};
