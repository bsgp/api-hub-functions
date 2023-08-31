function convToBoolean(value) {
  return value === "X";
}

module.exports = async (draft) => {
  // query all languages
  // English(E) is 1st priority, Korean(3) is next,

  const { result, errorMessage } = draft.response.body;
  // const extraColumns = [];

  if (errorMessage) {
    draft.json.terminateFlow = true;
    return;
  }

  const columnTexts = {
    tableName: "Table Name",
    position: "Position",
    fieldName: "Field Name",
    keyFlag: "Key Flag",
    mandatory: "Mandatory",
    notNull: "Not NULL",
    length: "Length",
    decimals: "Decimals",
    dataType: "Data Type",
    inDataType: "Internal Type",
    text: "Text",
    spras: "SAP Language",
  };

  const columnList = result.DATA.map((each) => {
    const row = {
      tableName: each.TABNAME,
      position: parseInt(each.POSITION, 10),
      fieldName: each.FIELDNAME,
      keyFlag: convToBoolean(each.KEYFLAG),
      mandatory: convToBoolean(each.MANDATORY),
      notNull: convToBoolean(each.NOTNULL),
      length: parseInt(each.LENG, 10),
      dataType: each.DATATYPE,
      inDataType: each.INTTYPE,
      decimals: Number(each.DECIMALS),
      // text: each.SCRTEXT_S || each.DDTEXT,
    };

    // extraColumns.forEach((colName) => {
    //   if (each[colName] !== undefined) {
    //     row[colName] = each[colName];
    //   }
    // });
    return row;
  });
  // .filter((col) => col.keyFlag || !["CHAR"].includes(col.dataType));

  columnList.sort((alpha, beta) => {
    // a is less than b by some ordering criterion
    if (alpha.tableName < beta.tableName) {
      return -1;
    }
    // a is greater than b by the ordering criterion
    if (alpha.tableName > beta.tableName) {
      return 1;
    }

    // a is less than b by some ordering criterion
    if (alpha.position < beta.position) {
      return -1;
    }
    // a is greater than b by the ordering criterion
    if (alpha.position > beta.position) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });

  draft.json.resBody = {
    count: columnList.length,
    list: columnList,
    columns: Object.keys(columnTexts)
      .map((key) => ({ FIELDNAME: key, FIELDTEXT: columnTexts[key] }))
      // .concat(
      //   result.FIELDS.filter((each) => extraColumns.includes(each.FIELDNAME))
      // )
      .map((each) => {
        return {
          name: each.FIELDNAME,
          text: each.FIELDTEXT,
        };
      }),
  };
};
