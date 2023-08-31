module.exports = async (draft, { loop }) => {
  // your script
  // 	{
  //     "TABLE_CATALOG": "ESH_DB",
  //     "TABLE_SCHEMA": "dbo",
  //     "TABLE_NAME": "VW_IF_MOC",
  //     "COLUMN_NAME": "ROWNUM",
  //     "ORDINAL_POSITION": 1,
  //     "COLUMN_DEFAULT": null,
  //     "IS_NULLABLE": "YES",
  //     "DATA_TYPE": "nchar",
  //     "CHARACTER_MAXIMUM_LENGTH": 50,
  //     "CHARACTER_OCTET_LENGTH": 100,
  //     "NUMERIC_PRECISION": null,
  //     "NUMERIC_PRECISION_RADIX": null,
  //     "NUMERIC_SCALE": null,
  //     "DATETIME_PRECISION": null,
  //     "CHARACTER_SET_CATALOG": null,
  //     "CHARACTER_SET_SCHEMA": null,
  //     "CHARACTER_SET_NAME": "UNICODE",
  //     "COLLATION_CATALOG": null,
  //     "COLLATION_SCHEMA": null,
  //     "COLLATION_NAME": "Korean_Wansung_CI_AS",
  //     "DOMAIN_CATALOG": null,
  //     "DOMAIN_SCHEMA": null,
  //     "DOMAIN_NAME": null
  //   },
  const colObjects = draft.json.dbResult.list.reduce((acc, each) => {
    let dataType;
    switch (each.DATA_TYPE) {
      case "nchar":
      case "varchar":
      case "datetime":
        dataType = "string";
        // if (
        //   each.CHARACTER_MAXIMUM_LENGTH >= 1 &&
        //   each.CHARACTER_MAXIMUM_LENGTH <= 255
        // ) {
        //   dataType = `char(${each.CHARACTER_MAXIMUM_LENGTH})`;
        // } else {
        //   dataType = "string";
        // }
        break;
      // case "P":
      //   // dataType = `decimal(${each.length},${each.decimals})`;
      //   dataType = "double";
      //   break;
      case "float":
      case "decimal":
        dataType = "double";
        break;
      case "int":
      case "bigint":
        dataType = "int";
        break;
      // case "F":
      //   dataType = "float";
      //   break;
      default:
        dataType = "unknown";
        break;
    }
    if (dataType === "unknown") {
      const error = new Error(
        [each.DATA_TYPE, each.COLUMN_NAME, JSON.stringify(each)].join(" ")
      );
      throw error;
    }
    acc[each.COLUMN_NAME.toLowerCase()] = {
      type: dataType,
      abapType: each.DATA_TYPE,
      text: each.COLUMN_NAME,
    };
    return acc;
  }, {});

  // if (colObjects) {
  //   draft.json.finalBody.list.push(colObjects);
  //   return;
  // }

  const multiPKey = loop.row.PartitionKey
    ? loop.row.PartitionKey.split("+")
    : [];

  const partitionKeys =
    loop.row.PartitionKey === "ignore"
      ? []
      : [multiPKey.join("").toLowerCase()];

  const result = {
    columns: Object.keys(colObjects).map((fieldName) => {
      if (partitionKeys.includes(fieldName)) {
        return {
          name: [fieldName, "origin"].join("_"),
          type: colObjects[fieldName].type,
          text: [
            colObjects[fieldName].abapType,
            colObjects[fieldName].text,
          ].join(" "),
        };
      } else {
        if (multiPKey.length <= 1) {
          return {
            name: fieldName,
            type: colObjects[fieldName].type,
            text: [
              colObjects[fieldName].abapType,
              colObjects[fieldName].text,
            ].join(" "),
          };
        } else {
          return {
            name: fieldName,
            type: "string",
            text: "concatenated",
          };
        }
      }
    }),
    partitions: partitionKeys.map((fieldName) => {
      if (multiPKey.length <= 1) {
        return {
          name: fieldName,
          type: colObjects[fieldName].type,
          text: [
            colObjects[fieldName].abapType,
            colObjects[fieldName].text,
          ].join(" "),
        };
      } else {
        return {
          name: fieldName,
          type: "string",
          text: "concatenated",
        };
      }
    }),
  };

  draft.json.columns = result.columns;
  draft.json.partitions = result.partitions;

  // draft.json.finalBody.list.push(result);
};
