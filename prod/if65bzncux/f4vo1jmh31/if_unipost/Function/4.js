module.exports = async (draft) => {
  if (draft.json.ifObj.Type === "WEBHOOK") {
    draft.json.nextNodeKey = "Function#6";
  } else {
    draft.json.nextNodeKey = "Function#3";
  }
};
