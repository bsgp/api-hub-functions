module.exports = async (draft, { request }) => {
  // draft.json.connection = JSON.parse(env.SAP_DEV);
  // const envSuffix = env.CURRENT_ALIAS || "DEV";
  // draft.json.connection = JSON.parse(
  //   env[["SAP", envSuffix.toUpperCase()].join("_")]
  // );

  /*
  Tables: DD02L
  Views: DD25L
  Structure: DD06L,
  Domain Values: DD07V
  */

  let newTableName = request.body.TableName.toUpperCase();

  const isLike = ["true", true].includes(request.body.IncludeWildcards);
  if (isLike) {
    newTableName = newTableName.replace(/[%?]/g, "_");
    newTableName = newTableName.replace(/\*/g, "%");
  }

  draft.json.parameters = {
    QUERY_TABLE: "DD02V", //"DD02L",
    DELIMITER: ",",
    OPTIONS: [
      `TABNAME ${isLike ? "like" : "eq"} '${newTableName}'`,
      `AND`,
      `DDLANGUAGE in ('E','3','1')`,
    ],
    NO_DATA: "",
    ROWCOUNT: 500,
    FIELDS: [
      // {
      //   FIELDNAME: "TABNAME",
      // },
      // {
      //   FIELDNAME: "AS4LOCAL",
      // },
    ],
  };
};
