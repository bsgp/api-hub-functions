module.exports = async (draft) => {
  const { result } = draft.response.body;
  const extraColumns = [];

  const tableObj = result.DATA.reduce((acc, each) => {
    const row = {
      name: each.TABNAME,
      text: each.DDTEXT,
      lang: each.DDLANGUAGE,
      langs: [{ text: each.DDTEXT, key: each.DDLANGUAGE }],
    };
    if (acc[row.name]) {
      if (row.lang === "E") {
        acc[row.name].lang = row.lang;
        acc[row.name].text = row.text;
      }
      acc[row.name].langs.push(row.langs[0]);
      return acc;
    }
    extraColumns.forEach((colName) => {
      if (each[colName] !== undefined) {
        row[colName] = each[colName];
      }
    });
    acc[row.name] = row;
    return acc;
  }, {});

  const tableList = Object.keys(tableObj).map((key) => tableObj[key]);

  draft.response.body = {
    count: tableList.length,
    list: tableList,
    columns: result.FIELDS.filter((each) =>
      extraColumns.includes(each.FIELDNAME)
    ).map((each) => {
      return {
        name: each.FIELDNAME,
        text: each.FIELDTEXT,
      };
    }),
  };
};
