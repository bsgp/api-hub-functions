module.exports = async (draft, { glue }) => {
  try {
    // const format = loop.row.PartitionFormat || "yyyyMMdd";
    const range = [];

    // range.push("NOW-3YEARS");
    // range.push("NOW+1YEARS");

    range.push("NOW-13MONTHS");
    range.push("NOW");

    // const [, intervalUnit] = Object.keys(TO).reduce(
    //   (acc, key) => {
    //     if (acc[0] === "") {
    //       return [acc[0], acc[1]];
    //     }
    //     const newFormat = acc[0].replace(key, "");
    //     return [newFormat, UNIT[key]];
    //   },
    //   [format]
    // );

    // const multiPKey = loop.row.PartitionKey
    //   ? loop.row.PartitionKey.split("+")
    //   : [];

    const projection = draft.json.partitionKey
      ? draft.json.projectionType === "injected"
        ? [
            {
              fieldName: draft.json.partitionKey,
              type: draft.json.projectionType,
            },
          ]
        : [
            {
              fieldName: draft.json.partitionKey,
              format: "yyyy/MM",
              interval: "1",
              "interval.unit": "MONTHS",
              type: "date",
              range: range.join(","),
            },
          ]
      : [];

    const result = await glue.table.create(draft.json.tbName, {
      useCustomerRole: true,
      dbName: draft.json.dbName,
      bucket: "impactus-3",
      dataType: "json",
      prefix: draft.json.s3Prefix,
      columns: draft.json.columns,
      partitions: draft.json.partitions,
      projection,
    });

    draft.response.body = { projection, result };
  } catch (ex) {
    draft.response.body = { ex, result: false };
  }
};
