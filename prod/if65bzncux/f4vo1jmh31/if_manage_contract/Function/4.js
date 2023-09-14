module.exports = async (draft, { lib, request }) => {
  const { clone } = lib;
  draft.json.newData = clone(request.body.Data);
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
    default:
      break;
  }
};
