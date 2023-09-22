module.exports = async (draft, { lib, file, request }) => {
  const { clone } = lib;
  draft.json.newData = clone(request.body.Data);

  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
  });
  draft.json.tables = tables;

  switch (request.body.InterfaceId) {
    case "IF-CT-101": // GET
      draft.json.nextNodeKey = "Function#5";
      break;
    case "IF-CT-102": // POST
      draft.json.nextNodeKey = "Function#6";
      break;
    case "IF-CT-103": // PATCH
      draft.json.nextNodeKey = "Function#7";
      break;
    case "IF-CT-105": // GET LIST
      draft.json.nextNodeKey = "Function#8";
      break;
    case "IF-CT-109": // GET CHANGED HISTORY
      draft.json.nextNodeKey = "Function#9";
      break;
    default:
      break;
  }
};
