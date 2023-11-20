module.exports = async (draft) => {
  const { ifObj } = draft.json;

  switch (ifObj.InterfaceId) {
    case "IF-FI-004":
    case "IF-CT-002":
      draft.json.nextNodeKey = "Function#5";

      break;
    default:
      if (ifObj.Function.Type === "WEBHOOK") {
        draft.json.nextNodeKey = "Function#7";
      } else {
        draft.json.nextNodeKey = "Function#6";
      }
      break;
  }
};
