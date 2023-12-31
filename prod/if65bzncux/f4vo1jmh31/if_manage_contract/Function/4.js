module.exports = async (draft, { lib, file, env, request }) => {
  const { clone } = lib;
  draft.json.newData = clone(request.body.Data);
  draft.json.userID = request.body.Function.UserId;
  draft.json.interfaceID = request.body.InterfaceId;

  const tables = await file.get("config/tables.json", {
    gziped: true,
    toJSON: true,
    stage: env.CURRENT_ALIAS,
  });
  draft.json.tables = tables;

  switch (request.body.InterfaceId) {
    case "IF-CT-101": // GET
    case "IF-CT-111":
      draft.json.nextNodeKey = "Function#5";
      break;
    case "IF-CT-102": // POST
    case "IF-CT-112":
      draft.json.nextNodeKey = "Function#6";
      break;
    case "IF-CT-103": // PATCH
    case "IF-CT-113":
      draft.json.nextNodeKey = "Function#7";
      break;
    case "IF-CT-105": // GET LIST
    case "IF-CT-115": // GET BILLING LIST
    case "IF-CT-118": // GET_UNMAP_LETTER_FROM_DB
      draft.json.nextNodeKey = "Function#8";
      break;
    case "IF-CT-106": // GET_PARTY_LIST_FROM_DB
      draft.json.nextNodeKey = "Function#10";
      break;
    case "IF-CT-108": // GET COMPARED SEQ CONTRACT
    case "IF-CT-109": // GET CHANGED HISTORY
      draft.json.nextNodeKey = "Function#9";
      break;
    case "IF-CT-110": // UPDATE_WBS_CONTRACT
    case "IF-CT-119": // MAPPING_LETTER_AND_CONTRACT
    case "IF-CT-120": // MIGRATION_CONTRACTS_TO_DB
      draft.json.nextNodeKey = "Function#11";
      break;
    default:
      break;
  }
};
