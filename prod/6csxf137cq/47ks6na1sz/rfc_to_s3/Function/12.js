module.exports = async (draft, { request, lib, env }) => {
  const { isArray } = lib;
  // const partitionKey = draft.json.ifObj.PartitionKey;
  // const fieldNames = partitionKey.split("+");

  if (draft.json.run === undefined) {
    draft.json.run = {
      rowCount: parseInt(env.SAP_MAX_COUNT, 10),
      rowSkips: 0,
    };
  } else {
    draft.json.run.rowCount += parseInt(env.SAP_MAX_COUNT, 10);
    draft.json.run.rowSkips += parseInt(env.SAP_MAX_COUNT, 10);
  }

  draft.json.sapQueryBody = {
    FunctionName: "/SAPDS/RFC_READ_TABLE", //request.body.FunctionName,
    TableName: draft.json.ifObj.Name,
    Options: Object.keys(request.body.Data).map((fieldName) => {
      const value = request.body.Data[fieldName];
      return {
        fieldName,
        value: isArray(value) ? value[0] : value,
        valueTo: isArray(value) ? value[1] : undefined,
      };
    }),
  };
};
