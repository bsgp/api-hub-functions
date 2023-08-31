module.exports = async (draft, { glue }) => {
  const { dbName } = draft.json;

  const result2 = await glue.db.get(dbName, {
    useCustomerRole: true,
  });
  draft.response.body = result2;
};
