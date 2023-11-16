module.exports = async (draft) => {
  const { ifObj } = draft.json;

  switch (ifObj.InterfaceId) {
    case "IF-FI-004":
      draft.json.nextNodeKey = "Function#5";

      break;
    default:
      draft.json.nextNodeKey = "Function#6";
      break;
  }
};
