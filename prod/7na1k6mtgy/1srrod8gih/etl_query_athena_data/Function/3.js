function fillQuote(value) {
  return ["'", value, "'"].join("");
}
function fillDoubleQuote(value) {
  return ['"', value, '"'].join("");
}

module.exports = async (draft, { request, athena, dynamodb }) => {
  const tableName = [request.body.TableName, request.body.DatasetName]
    .join("_")
    .toLowerCase();
  const dbName =
    request.partnerId === "2lg61v0a77"
      ? ["ecc_dev_datalake", request.stage].join("_")
      : ["etl_db", request.stage].join("_");

  const stmtParts = ["SELECT"];
  stmtParts.push(request.body.Columns.map(fillDoubleQuote).join(", "));
  stmtParts.push("FROM");
  stmtParts.push(fillDoubleQuote(tableName));

  const dsData = await dynamodb.getItem("etl_ds", {
    tb: request.body.TableName.toLowerCase(),
    id: request.body.DatasetName.toLowerCase(),
  });
  const { RangeField, WithoutRangeField } = dsData.originQuery;

  // if (!WithoutRangeField) {
  //   stmtParts.push("WHERE");
  // }

  let hasRangeField = false;
  const condStmtList = request.body.Options.map((opt) => {
    if (opt.fieldName.toLowerCase() === RangeField.toLowerCase()) {
      hasRangeField = true;
    }
    let condParts = [fillDoubleQuote(opt.fieldName), "=", fillQuote(opt.value)];
    if (opt.valueTo) {
      condParts = [
        fillDoubleQuote(opt.fieldName),
        "BETWEEN",
        fillQuote(opt.value),
        "AND",
        fillQuote(opt.valueTo),
      ];
    }
    // stmtParts.push(condParts.join(" "));
    return condParts.join(" ");
  });

  if (condStmtList.length > 0) {
    stmtParts.push("WHERE");
    stmtParts.push(...condStmtList);
  }

  stmtParts.push("LIMIT 5");

  if (hasRangeField === false && !WithoutRangeField) {
    draft.response.body = {
      errorMessage: "검색조건에 Range Field는 반드시 포함되어야 합니다",
    };
    draft.json.terminateFlow = true;
    return;
  }
  console.log(JSON.stringify(stmtParts), "stmtParts");

  const result = await athena.startQuery(stmtParts.join(" "), dbName, {
    useCustomerRole: true,
  });
  draft.response.body.queryId = result;

  if (request.body.AsyncMode === true) {
    draft.json.nextNodeKey = "Output#2";
  } else {
    draft.json.nextNodeKey = "Function#4";
  }
};
