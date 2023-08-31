module.exports = async (draft, { request }) => {
  const type = request.params.type;
  draft.response.body = { type };
  if (request.method === "POST") {
    draft.json.nextNodeKey = "Function#12";
  } else if (request.method === "GET") {
    switch (type) {
      case "import":
        draft.json.nextNodeKey = "Function#5";
        break;
      case "export":
        draft.json.nextNodeKey = "Function#6";
        break;
      case "companyID":
        draft.json.nextNodeKey = "Function#7";
        break;
      case "taxCodes":
        draft.json.nextNodeKey = "Function#8";
        break;
      case "ledgerCodes":
        draft.json.nextNodeKey = "Function#9";
        break;
      case "costCenters":
        draft.json.nextNodeKey = "Function#10";
        break;
      case "enrollCardData":
        draft.json.nextNodeKey = "Function#11";
        break;
      default:
        draft.json.nextNodeKey = "Function#4";
        break;
    }
  }
};
