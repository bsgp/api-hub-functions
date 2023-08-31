module.exports = async (draft, { glue }) => {
  const { dbName } = draft.json;

  const result = await glue.db.create(dbName, {
    useCustomerRole: true,
  });

  draft.response.body = result;
};
