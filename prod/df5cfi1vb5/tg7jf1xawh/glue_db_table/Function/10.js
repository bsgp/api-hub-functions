module.exports = async (draft, { loop, glue }) => {
  if (loop.row.PartitionKey === undefined) {
    draft.json.nextNodeKey = "EndLoop#11";
    draft.json.finalBody.list.push([loop.row.InterfaceId, false]);
    return;
  }

  try {
    await glue.table.get(
      (loop.row.DatasetName || loop.row.Name).toLowerCase(),
      {
        useCustomerRole: true,
        dbName: draft.json.dbName,
      }
    );

    draft.json.finalBody.list.push([
      loop.row.InterfaceId,
      false,
      "already exists",
    ]);
    draft.json.nextNodeKey = "EndLoop#11";
    return;
  } catch (ex) {
    // pass
  }

  draft.json.ifId = loop.row.InterfaceId;

  switch (loop.row.Type) {
    case "RFC":
      draft.json.nextNodeKey = "Function#9";
      break;
    case "DB":
      draft.json.nextNodeKey = "Function#16";
      break;
    default:
      draft.json.nextNodeKey = "EndLoop#11";
      break;
  }
};
