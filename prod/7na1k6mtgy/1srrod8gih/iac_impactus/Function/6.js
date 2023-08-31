module.exports = async (draft, { glue, request }) => {
  const dbName = ["impactus", request.stage].join("_");

  if (request.body.Type === "DB") {
    const result = await glue.db.create(dbName, {
      useCustomerRole: true,
    });
    draft.response.body = { result };
  } else if (request.body.Type === "Table") {
    const tblName = request.body.Name;
    const columns = request.body.Columns;
    const partitions = request.body.Partitions;
    const projection = request.body.Projection;
    const prefix = request.body.Prefix;

    const result = await glue.table.create(tblName, {
      useCustomerRole: true,
      dbName,
      columns,
      prefix: ["stream", dbName, prefix].join("/"),
      dataType: "json",
      partitions,
      projection,
      // loop.row.PartitionKey === "ignore"
      //   ? undefined
      //   : [
      //       {
      //         fieldName: multiPKey.join("").toLowerCase(),
      //         format,
      //         interval: "1",
      //         "interval.unit": intervalUnit,
      //         type: "date",
      //         range: range.join(","),
      //       },
      //     ],
    });
    draft.response.body = { result };
  } else {
    draft.response.body = { errorMessage: "Unexpected body.Type" };
  }
};
