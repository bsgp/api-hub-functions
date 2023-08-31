function convertWildcards(value, includeWildcards) {
  let newValue = value;
  if (includeWildcards === true) {
    newValue = newValue.replace(/[%?]/g, "_");
    newValue = newValue.replace(/\*/g, "%");
  }
  return newValue;
}

function getOperator(opt, { isTruthy }) {
  if (isTruthy(opt.values)) {
    return "in";
  }
  if (opt.valueTo) {
    return "between";
  }
  if (opt.includeWildcards === true) {
    return "like";
  }
  return "eq";
}

function getRightHand(opt, { isTruthy }) {
  if (isTruthy(opt.values)) {
    return [
      "( ",
      opt.values.map((each) => ["'", each, "'"].join("")).join(", "),
      " )",
    ];
  }
  if (opt.valueTo) {
    return [
      ["'", opt.value, "'"].join(""),
      "and",
      ["'", opt.valueTo, "'"].join(""),
    ];
  }
  return [
    ["'", convertWildcards(opt.value, opt.includeWildcards), "'"].join(""),
  ];
}

module.exports = async (draft, { request, loop, env, lib }) => {
  const options = request.body.Options || [];
  const { tryit, isTruthy } = lib;

  draft.json.parameters = {
    QUERY_TABLE: request.body.TableName.toUpperCase(),
    DELIMITER: ",",
    OPTIONS: options
      .filter((opt) => opt.fieldName)
      .map((opt) => {
        // const operator = opt.valueTo
        //     ? "between"
        //     : opt.includeWildcards === true
        //     ? "like"
        //     : "eq";
        return [
          opt.fieldName,
          getOperator(opt, { isTruthy }),
          ...getRightHand(opt, { isTruthy }),
          // ...(opt.valueTo
          //   ? [
          //       ["'", opt.value, "'"].join(""),
          //       "and",
          //       ["'", opt.valueTo, "'"].join(""),
          //     ]
          //   : [
          //       [
          //         "'",
          //         convertWildcards(opt.value, opt.includeWildcards),
          //         "'",
          //       ].join(""),
          //     ]),
        ].join(" ");
      })
      .concat(options.filter((opt) => opt.subQuery).map((opt) => opt.subQuery))
      .join("\nAND\n")
      .split("\n"),
    NO_DATA: "",
    ROWCOUNT:
      draft.json.run.rowCount ||
      tryit(() => parseInt(env.SAP_MAX_ROWS, 10)) ||
      300,
    ROWSKIPS: draft.json.run.rowSkips || 0,
    FIELDS: loop.row.map((col) => ({
      FIELDNAME: col.fieldName,
    })),
  };
};
