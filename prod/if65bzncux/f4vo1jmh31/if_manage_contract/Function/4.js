module.exports = async (draft, { lib, file, env, request }) => {
  const { clone } = lib;
  draft.json.newData = clone(request.body.Data);
  draft.json.userID = request.body.Function.UserId;

  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
    stage: env.CURRENT_ALIAS,
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
    case "IF-CT-106": // GET_PARTY_LIST_FROM_DB
      draft.json.nextNodeKey = "Function#10";
      break;
    case "IF-CT-109": // GET CHANGED HISTORY
      draft.json.nextNodeKey = "Function#9";
      break;
    case "IF-CT-110": // UPDATE_WBS_CONTRACT
      draft.json.nextNodeKey = "Function#11";
      break;
    default:
      break;
  }
};
