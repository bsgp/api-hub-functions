module.exports = async (draft, { loop }) => {
  // your script
  // 	OWNER: 'PEOPLE',
  // TABLE_NAME: 'JTM_DASHBOARD_OVER_TIME',
  // COLUMN_NAME: 'OT_TIME',
  // DATA_TYPE: 'NUMBER',
  // DATA_TYPE_MOD: '',
  // DATA_TYPE_OWNER: '',
  // DATA_LENGTH: 22,
  // DATA_PRECISION: 0,
  // DATA_SCALE: 0,
  // NULLABLE: 'Y',
  // COLUMN_ID: 7,
  // DEFAULT_LENGTH: 0,
  // DATA_DEFAULT: null,
  // NUM_DISTINCT: 0,
  // LOW_VALUE: null,
  // HIGH_VALUE: null,
  // DENSITY: 0,
  // NUM_NULLS: 0,
  // NUM_BUCKETS: 0,
  // LAST_ANALYZED: '',
  // SAMPLE_SIZE: 0,
  // CHARACTER_SET_NAME: '',
  // CHAR_COL_DECL_LENGTH: 0,
  // GLOBAL_STATS: 'NO',
  // USER_STATS: 'NO',
  // AVG_COL_LEN: 0,
  // CHAR_LENGTH: 0,
  // CHAR_USED: '',
  // V80_FMT_IMAGE: 'NO',
  // DATA_UPGRADED: 'YES',
  // HISTOGRAM: 'NONE',
  // DEFAULT_ON_NULL: 'NO',
  // IDENTITY_COLUMN: 'NO',
  // EVALUATION_EDITION: '',
  // UNUSABLE_BEFORE: '',
  // UNUSABLE_BEGINNING: '',
  // COLLATION: ''
  const colObjects = draft.json.dbResult.list.reduce((acc, each) => {
    let dataType;
    console.log("each:", each);
    switch (each.DATA_TYPE) {
      case "nchar":
      case "VARCHAR2":
      case "DATE":
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
      case "NUMBER":
        if (
          each.DATA_LENGTH > 0 &&
          each.DATA_PRECISION === 0 &&
          each.DATA_SCALE === 0
        ) {
          dataType = "double";
        } else {
          dataType = "int";
        }
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
