module.exports = async (draft, { glue }) => {
  await glue.db.create(draft.json.dbName, {
    useCustomerRole: true,
  });
};
