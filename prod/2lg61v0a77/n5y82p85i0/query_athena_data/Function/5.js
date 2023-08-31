module.exports = async (draft, { athena, request }) => {
  const { queryId } = draft.response.body;

  const result = await athena.getQueryResults(queryId, {
    useCustomerRole: true,
  });
  draft.response.body.results = result;

  if (request.body.ForSe11 === true) {
    const columns = result.ResultSetMetadata.ColumnInfo.map(
      (each) => each.Name
    );

    result.Rows.shift();
    const list = result.Rows.map((each) => {
      return columns.reduce((acc, colName, colIdx) => {
        acc[colName] = each.Data[colIdx].VarCharValue;
        return acc;
      }, {});
    });

    draft.response.body = {
      count: list.length,
      list,
    };
  }
};
