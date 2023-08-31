const conv = (value, type) => {
  if (value === null) {
    switch (type) {
      case "char":
        return "";
      case "numc":
        return "0";
      case "dats":
        return "00000000";
      case "tims":
        return "000000";
      case "int":
        return 0;
      default:
        return value;
    }
  }
  switch (type) {
    case "char":
      return value.toString();
    case "numc":
      return value.toString();
    case "int":
      return value;
    default:
      return value;
  }
};

module.exports = async (draft, { lib }) => {
  const { isArray } = lib;
  const { builder } = draft.pipe.ref;
  const { dbTable, rfcTable, fieldConverter } = draft.pipe.json;

  const query = builder.select(dbTable).limit(1);
  const selResult = await query.run();
  // draft.response = selResult;

  const dbRecordList = selResult.body.list;
  if (!isArray(dbRecordList)) {
    draft.response.body = {
      errorMessage: "DB로부터 처리할 데이터를 취득하지 못하였습니다",
    };
    draft.json.terminateFlow = true;
    return;
  }

  const result = [];
  const length = dbRecordList.length;
  for (let index = 0; index < length; index += 1) {
    const each = dbRecordList[index];
    const getDbFields = new Function("each", "conv", fieldConverter);
    const rfcParameters = getDbFields(each, conv);

    result.push(rfcParameters);
  }

  draft.pipe.json.parameters = {
    [rfcTable]: result,
  };
  draft.response.body = draft.pipe.json.parameters;
};
