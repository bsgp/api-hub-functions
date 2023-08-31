module.exports = async (draft, { request, lib, env }) => {
  const { isArray } = lib;
  const partitionKey = draft.json.ifObj.PartitionKey;
  const value = request.body.Data[partitionKey];
  const valueTo = isArray(value) ? value[1] : undefined;

  if (draft.json.run === undefined) {
    draft.json.run = {
      rowCount: env.SAP_MAX_COUNT,
      rowSkips: 0,
    };
  } else {
    draft.json.run.rowCount += env.SAP_MAX_COUNT;
    draft.json.run.rowSkips += env.SAP_MAX_COUNT;
  }

  draft.json.sapQueryBody = {
    FunctionName: request.body.FunctionName,
    TableName: draft.json.ifObj.Name,
    Options: [
      {
        fieldName: partitionKey,
        value: isArray(value) ? value[0] : value,
        valueTo,
      },
    ],
  };
};
