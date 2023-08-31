module.exports = async (draft, { file, sql }) => {
  // confirmationjournalDB
  if (draft.json.notSaveFile) {
    return;
  }
  const tableConfig = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });
  const confirmationJournal = draft.json.confirmationJournal;
  const table = tableConfig.confirmationjournal.name;
  const builder = sql("mysql");
  const db_result = await builder
    .insert(table, confirmationJournal)
    .onConflict(["CCONF_ID", "CISTOCK_UUID", "CITEM_ID"])
    .merge()
    .run();

  draft.response.body.db_result = db_result;
};
