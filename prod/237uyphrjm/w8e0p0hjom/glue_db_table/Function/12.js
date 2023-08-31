module.exports = async (draft, { loop, lib }) => {
  const { tryit } = lib;

  const tableName = loop.row.IsSapTable
    ? loop.row.Name
    : draft.json.rfc.body.result.PARAMS.find((each) => each.PARAMCLASS === "T")
        .TABNAME;

  // draft.json.finalBody.list.push(draft.json.rfc.body.result.PARAMS);

  draft.json.bodyGetColumnReq = {
    TableName: tableName,
  };

  draft.json.sapTableName = tableName;
  draft.json.rfcParamsMeta = tryit(() => draft.json.rfc.body.result.PARAMS);
};
