module.exports = async (draft, { file }) => {
  const tables = {
    outbound: {
      name: "OUTBOUND_TASK_2",
      desc: "판매 출고"
    }
  };

  const result = await file.upload("config/tables.json", tables, {
    gzip: true
  });

  draft.pipe.json.tables = tables;
};

