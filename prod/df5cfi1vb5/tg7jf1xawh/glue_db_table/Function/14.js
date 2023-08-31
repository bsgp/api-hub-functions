module.exports = async (draft, { loop }) => {
  // if (draft.response.body.list) {
  //   draft.json.finalBody.list.push(draft.response.body.list);
  //   return;
  // }

  const colObjects = draft.response.body.list.reduce((acc, each) => {
    if (each.fieldName === ".INCLUDE") {
      return acc;
    }

    let dataType = "unknown";
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
        dataType = "string";
        break;
      case "F":
        dataType = "float";
        break;
      default:
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

  draft.json.finalBody.list.push([
    loop.row.InterfaceId,
    draft.json.sapTableName,
    colObjects,
    draft.response.body.list,
  ]);

  const partitionKeys =
    loop.row.PartitionKey === "ignore"
      ? []
      : [loop.row.PartitionKey.toLowerCase()];
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
      const col = colObjects[fieldName];
      // || {
      //   type: "char(6)",
      //   abapType: "CHAR",
      //   text: "SPMON",
      // };
      return {
        name: fieldName,
        type: col.type,
        text: [col.abapType, col.text].join(" "),
      };
    }),
  };

  draft.json.columns = result.columns;
  draft.json.partitions = result.partitions;

  // draft.json.finalBody.list.push(result);
};
