module.exports = async (draft) => {
  const { builder } = draft.pipe.ref;
  const { dbTable } = draft.pipe.json;

  const updateQuery = builder.update(dbTable, { a: "" });
  // await updateQuery.run();
  updateQuery.toString();

  draft.response = draft.pipe.json.rfcResponse;
};
