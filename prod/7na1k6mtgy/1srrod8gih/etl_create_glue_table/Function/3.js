const convertCols =
  (isKey = false, tableName, index) =>
  (Col) => {
    const typeParts = Col.Type.split(/[()]/);
    if (Col.Type === "int") {
      typeParts[1] = "10";
    }
    const [inDataType, length] = typeParts;
    const [dataType] = Col.Comment.split(" ", 1);
    const [precision, scale] = (length || "").split(",");
    return {
      tableName,
      fieldName: Col.Name,
      keyFlag: isKey,
      dataType,
      position: index + 1,
      length: Number(precision),
      decimals: Number(scale),
      inDataType,
      text: Col.Comment.replace([dataType, " "].join(""), ""),
    };
  };

module.exports = async (draft, { request, glue }) => {
  const tableName = [request.body.TableName, request.body.DatasetName]
    .join("_")
    .toLowerCase();
  const { dbName } = draft.json;
  const result = await glue.table.get(tableName, {
    dbName,
    useCustomerRole: true,
  });
  draft.response.body = result;

  if (request.body.ForSe11) {
    const columnTexts = {
      tableName: "Table Name",
      position: "Position",
      fieldName: "Field Name",
      keyFlag: "Key Flag",
      length: "Length",
      decimals: "Decimals",
      dataType: "Data Type",
      inDataType: "Internal Type",
      text: "Text",
    };

    draft.response.body = {
      columns: Object.keys(columnTexts)
        .map((key) => ({ FIELDNAME: key, FIELDTEXT: columnTexts[key] }))
        .map((each) => {
          return {
            name: each.FIELDNAME,
            text: each.FIELDTEXT,
          };
        }),
      count: 0,
      list: [],
    };
    result.Table.PartitionKeys.forEach((Col, index) => {
      draft.response.body.list.push(convertCols(true, tableName, index)(Col));
    });
    result.Table.StorageDescriptor.Columns.forEach((Col, index) => {
      draft.response.body.list.push(convertCols(false, tableName, index)(Col));
    });
    draft.response.body.count = draft.response.body.list.length;
  }
};
