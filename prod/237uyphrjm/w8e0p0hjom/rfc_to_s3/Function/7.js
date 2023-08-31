module.exports = async (draft, { request, kst, isTruthy }) => {
  const { builder } = draft.ref;

  const query = builder.select(draft.json.dbTableName);

  if (draft.json.partitionKey) {
    if (draft.json.partitionKey !== "ignore") {
      const multiPKey = draft.json.partitionKey.split("+");
      if (multiPKey.length > 1) {
        multiPKey.forEach((eachPKey) => {
          query.whereNotNull(eachPKey);
        });
      } else {
        query.whereNotNull(draft.json.partitionKey);
      }
    }
  }
  // query.where({ detail_seq: 1096 });

  query.limit(100000);

  switch (draft.json.ifId) {
    case "IF-GHR-001":
      if (isTruthy(request.body.Data)) {
        query.whereBetween("SYSDATE_ORIGIN", [
          request.body.Data.YmdFrom,
          request.body.Data.YmdTo,
        ]);
      } else {
        query.whereBetween("SYSDATE_ORIGIN", [
          kst.subtract(1, "months").format("YYYYMMDD"),
          kst.format("YYYYMMDD"),
        ]);
      }
      break;
    case "IF-GHR-002":
    case "IF-GHR-003":
    case "IF-GHR-004":
      if (isTruthy(request.body.Data)) {
        query.whereBetween("PAYYM", [
          request.body.Data.YmdFrom,
          request.body.Data.YmdTo,
        ]);
      } else {
        query.whereBetween("PAYYM", [
          kst.subtract(1, "months").format("YYYYMM"),
          kst.format("YYYYMM"),
        ]);
      }
      break;
    default:
      break;
  }

  const result = await query.run();

  draft.json.dbResult = result.body;
  draft.response = result;
};
