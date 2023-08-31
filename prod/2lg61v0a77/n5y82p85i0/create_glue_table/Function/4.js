module.exports = async (draft, { request, glue, dynamodb, lib }) => {
  const { isArray } = lib;
  const dsData = await dynamodb.getItem("etl_ds", {
    tb: request.body.TableName.toLowerCase(),
    id: request.body.DatasetName.toLowerCase(),
  });

  const { RangeField } = dsData.originQuery;

  const tableName = [request.body.TableName, request.body.DatasetName]
    .join("_")
    .toLowerCase();
  const partitionKeys = (
    isArray(RangeField) ? RangeField : RangeField ? [RangeField] : []
  ).map((key) => key.toLowerCase());
  const expectedColumns = request.body.Columns || [];

  const colObjects = draft.response.body.list
    .filter((col) => {
      if (col.keyFlag) {
        return true;
      }
      if ([".INCLU--AP", ".INCLUDE"].includes(col.fieldName)) {
        return false;
      }
      if (expectedColumns && expectedColumns.length > 0) {
        return expectedColumns.includes(col.fieldName);
      }
      return true;
    })
    .reduce((acc, each) => {
      let dataType;
      switch (each.inDataType) {
        case "N":
        case "C":
        case "D":
        case "T":
          // dataType = "string";
          dataType = `char(${each.length})`;
          break;
        case "P":
          // dataType = `decimal(${each.length},${each.decimals})`;
          dataType = "double";
          break;
        case "X":
          dataType = "int";
          break;
        case "F":
          dataType = "float";
          break;
        default:
          dataType = "unknown";
          break;
      }
      if (dataType === "unknown") {
        throw new Error(
          [each.inDataType, each.fieldName, each.dataType].join(" ")
        );
      }
      acc[each.fieldName.toLowerCase()] = {
        type: dataType,
        abapType: each.dataType,
        text: each.text,
      };
      return acc;
    }, {});

  const dbName = ["ecc_dev_datalake", request.stage].join("_");
  const result = await glue.table.create(tableName, {
    dbName,
    useCustomerRole: true,
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
        return {
          name: fieldName,
          type: colObjects[fieldName].type,
          text: [
            colObjects[fieldName].abapType,
            colObjects[fieldName].text,
          ].join(" "),
        };
      }
    }),
    partitions: partitionKeys.map((fieldName) => {
      return {
        name: fieldName,
        type: colObjects[fieldName].type,
        text: [colObjects[fieldName].abapType, colObjects[fieldName].text].join(
          " "
        ),
      };
    }),
    projection: Object.keys(colObjects)
      .filter((fieldName) => {
        if (colObjects[fieldName].abapType === "DATS") {
          if (partitionKeys.includes(fieldName)) {
            return true;
          }
        }
        return false;
      })
      .map((fieldName) => {
        return {
          fieldName,
          format: "yyyyMMdd",
          interval: "1",
          "interval.unit": "DAYS",
          type: "date",
          range: "20000101,20991231",
        };
      }),
  });

  await dynamodb.updateItem(
    "etl_ds",
    {
      tb: request.body.TableName.toLowerCase(),
      id: request.body.DatasetName.toLowerCase(),
    },
    { athenaTableName: tableName }
  );

  draft.response.body = {
    dbName,
    tableName,
    succeed: result,
  };
};
