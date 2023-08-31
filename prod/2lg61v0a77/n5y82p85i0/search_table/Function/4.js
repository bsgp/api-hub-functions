function convertWildcards(value, includeWildcards) {
  let newValue = value;
  if (includeWildcards === true) {
    newValue = newValue.replace(/%/g, "_");
    newValue = newValue.replace(/\*/g, "%");
  }
  return newValue;
}

module.exports = async (draft, { request, loop }) => {
  const options = request.body.Options || [];

  draft.json.parameters = {
    QUERY_TABLE: request.body.TableName,
    DELIMITER: ",",
    OPTIONS: options
      .filter((opt) => opt.fieldName)
      .map((opt) => {
        return [
          opt.fieldName,
          opt.valueTo
            ? "between"
            : opt.includeWildcards === true
            ? "like"
            : "eq",
          ...(opt.valueTo
            ? [
                ["'", opt.value, "'"].join(""),
                "and",
                ["'", opt.valueTo, "'"].join(""),
              ]
            : [
                [
                  "'",
                  convertWildcards(opt.value, opt.includeWildcards),
                  "'",
                ].join(""),
              ]),
        ].join(" ");
      })
      .join("\nAND\n")
      .split("\n"),
    NO_DATA: "",
    ROWCOUNT: draft.json.run.rowCount || 300,
    ROWSKIPS: draft.json.run.rowSkips || 0,
    FIELDS: loop.row.map((col) => ({
      FIELDNAME: col.fieldName,
    })),
  };
};
