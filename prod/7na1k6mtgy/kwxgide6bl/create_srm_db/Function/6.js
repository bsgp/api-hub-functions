module.exports = async (draft, { file, log }) => {
  const tables = {
    IDN_HEADER: {
      name: "IDN_HEADER_13",
      desc: "IDN List DB",
    },
    IDN_ITEMS: {
      name: "IDN_ITEMS_13",
      desc: "IDN Item List DB",
    },
    ORDER_ITEMS: {
      name: "ORDER_ITEMS_13",
      desc: "ORDER Item List DB",
    },
  };

  const uploadConfig = await file.upload("config/tables.json", tables, {
    gzip: true,
  });
  log("upload tables config:", uploadConfig);

  draft.pipe.json.tables = tables;
  draft.response.body = {};
};
