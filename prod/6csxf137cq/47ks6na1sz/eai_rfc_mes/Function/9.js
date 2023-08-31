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

module.exports = async (draft, { lib, loop }) => {
  const { isArray } = lib;
  const { builder } = draft.pipe.ref;
  const { dbTable, rfcTable, fieldConverter, dbKeyFields } = draft.pipe.json;

  if (!draft.pipe.json.resultList) {
    draft.pipe.json.resultList = [];
  }

  const query = builder.select(dbTable).limit(100).whereIn("ZXSTAT", ["R"]);
  // .where(function () {
  //   this.where("ZXSTAT", "").orWhereNull("ZXSTAT");
  // });
  const selResult = await query.run();
  // draft.response = selResult;

  const dbRecordList = selResult.body.list;
  if (!isArray(dbRecordList) || dbRecordList.length === 0) {
    draft.response.body = {
      errorMessage: "DB로부터 처리할 데이터를 취득하지 못하였습니다",
      loop,
    };
    draft.json.terminateFlow = true;
    return;
  }

  const length = dbRecordList.length;

  // ZXSTAT: "S",
  // ZXDATS: knex.raw("CONVERT(CHAR(8),GETDATE(),112)"),
  // ZXTIMS: knex.raw("REPLACE(CONVERT(CHAR(8),GETDATE(),108),':','')"),
  // ZXMSGS: "",

  const multiQuery = builder.multi(dbTable);
  for (let index = 0; index < length; index += 1) {
    const each = dbRecordList[index];
    multiQuery.add(function () {
      const subQuery = this.update({ ZXSTAT: "P" }).returning(["ZXSTAT"]);
      dbKeyFields.forEach((keyField) => {
        subQuery.where({ [keyField]: each[keyField] });
      });
    });
  }
  const updateToR = await multiQuery.run();

  const result = [];
  for (let index = 0; index < length; index += 1) {
    const each = dbRecordList[index];
    const getDbFields = new Function("each", "conv", fieldConverter);
    const rfcParameters = getDbFields(each, conv);

    result.push(rfcParameters);
  }

  draft.pipe.json.dbRecordList = dbRecordList;
  draft.pipe.json.parameters = {
    [rfcTable]: result,
  };
  draft.response.body = { result, dbRecordList, updateToR };
};
