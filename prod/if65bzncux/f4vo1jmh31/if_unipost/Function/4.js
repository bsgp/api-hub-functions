module.exports = async (draft) => {
  if (draft.json.ifObj.Type === "WEBHOOK") {
    draft.json.nextNodeKey = "Function#5";
  } else {
    draft.json.nextNodeKey = "Function#3";
  }
};
