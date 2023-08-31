module.exports = async (draft, { loop, glue }) => {
  // const FROM = {
  //   yyyy: "2000",
  //   MM: "01",
  //   dd: "01",
  // };
  const TO = {
    yyyy: "2099",
    MM: "12",
    dd: "31",
  };
  const UNIT = {
    yyyy: "YEARS",
    MM: "MONTHS",
    dd: "DAYS",
  };

  try {
    const format = loop.row.PartitionFormat || "yyyyMMdd";
    const range = [];

    // range.push(
    //   Object.keys(FROM).reduce((acc, key) => {
    //     return acc.replace(key, FROM[key]);
    //   }, format)
    // );
    // range.push(
    //   Object.keys(TO).reduce((acc, key) => {
    //     return acc.replace(key, TO[key]);
    //   }, format)
    // );
    range.push("NOW-3YEARS");
    range.push("NOW+1YEARS");
    // NOW-1YEARS,NOW

    const [, intervalUnit] = Object.keys(TO).reduce(
      (acc, key) => {
        if (acc[0] === "") {
          return [acc[0], acc[1]];
        }
        if (acc[0].includes(key)) {
          const newFormat = acc[0].replace(key, "");
          return [newFormat, UNIT[key]];
        } else {
          return [acc[0], acc[1]];
        }
      },
      [format]
    );

    const multiPKey = loop.row.PartitionKey
      ? loop.row.PartitionKey.split("+")
      : [];

    const result = await glue.table.create(
      (loop.row.DatasetName || loop.row.Name).toLowerCase(),
      {
        useCustomerRole: true,
        dbName: draft.json.dbName,
        columns: draft.json.columns,
        partitions: draft.json.partitions,
        projection:
          loop.row.PartitionKey === "ignore"
            ? undefined
            : [
                {
                  fieldName: multiPKey.join("_").toLowerCase(),
                  format: format.replace("'0'", "-"),
                  interval: "1",
                  "interval.unit": intervalUnit,
                  type: "date",
                  range: range.join(","),
                },
              ],
      }
    );

    draft.json.finalBody.list.push({ result, range, format });
  } catch (ex) {
    draft.json.finalBody.list.push({ result: false, ex });
  }
};
