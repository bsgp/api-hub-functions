module.exports = async (draft, { request, env }) => {
  const envSuffix = env.CURRENT_ALIAS || "DEV";
  draft.json.connection = JSON.parse(
    env[["SAP", envSuffix.toUpperCase()].join("_")]
  );
  /*
  Tables: DD02L
  Table Fields: DD03L
  Views: DD25L
  Structure: DD06L,
  Domain Values: DD07V
  */

  let newTableName = request.body.TableName.toUpperCase();
  const isLike = /[*%?]/.test(newTableName);
  if (isLike) {
    newTableName = newTableName.replace(/%/g, "_");
    newTableName = newTableName.replace(/\*/g, "%");
  }

  draft.json.parameters = {
    QUERY_TABLE: "DD03VT", //"DD02L",
    DELIMITER: ",",
    OPTIONS: [
      `TABNAME ${isLike ? "like" : "eq"} '${newTableName}'`,
      `AND`,
      `DDLANGUAGE in ('E','3','1')`,
    ],
    NO_DATA: "",
    ROWCOUNT: 0,
    FIELDS: [
      "TABNAME",
      "FIELDNAME",
      // "POSITION",
      // "KEYFLAG",
      // "MANDATORY",
      // "PRECFIELD",
      // "ROLLNAME",
      // "DOMNAME",
      // "INTTYPE",
      // "INTLEN",
      // "NOTNULL",
      // "LENG",
      // "DATATYPE",
      // "DEPTH",
      "DDLANGUAGE",
      "DDTEXT",
      "REPTEXT",
      "SCRTEXT_S",
    ].map((fName) => ({
      FIELDNAME: fName,
    })),
  };
};
