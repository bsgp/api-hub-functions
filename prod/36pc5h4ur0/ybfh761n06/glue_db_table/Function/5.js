module.exports = async (draft, { athena, wait }) => {
  const queryId = await athena.startQuery(
    draft.json.statement,
    draft.json.dbName,
    { useCustomerRole: true }
  );
  await wait(2);
  const result = await athena.getQueryResults(queryId, {
    useCustomerRole: true,
  });
  draft.response.body = { queryId, result };
};
