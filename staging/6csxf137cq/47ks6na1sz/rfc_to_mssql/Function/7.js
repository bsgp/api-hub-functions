module.exports = async (draft, { request }) => {
  switch (request.body.InterfaceId) {
    case "IF_001":
      draft.json.nextNodeKey = "Function#5";
      break;
    case "IF_002":
      draft.json.nextNodeKey = "Function#8";
      break;
    case "IF_003":
      draft.json.nextNodeKey = "Function#12";
      break;
    default:
      throw new Error(
        ["Unsupported Interface ID", request.body.InterfaceId].join("")
      );
  }
};
