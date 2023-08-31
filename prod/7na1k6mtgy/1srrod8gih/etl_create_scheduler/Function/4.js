module.exports = async (draft, { request }) => {
  switch (request.method) {
    case "GET": {
      draft.json.nextNodeKey = "Function#5";
      break;
    }
    case "POST": {
      draft.json.nextNodeKey = "Function#3";
      break;
    }
    case "DELETE": {
      draft.json.nextNodeKey = "Function#6";
      break;
    }
    default: {
      draft.response.body = {
        errorMessage: `Unsupported Method:${request.method}`,
      };
      draft.json.terminateFlow = true;
      break;
    }
    // code
  }
};
