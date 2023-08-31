module.exports = async (draft, { athena }) => {
  const { queryId } = draft.response.body;

  const result = await athena.getQueryState(queryId, {
    useCustomerRole: true,
  });
  draft.response.body.currentState = result.currentState;
  draft.response.body.stateMessage = result.stateMessage;
  draft.response.body.queryStatement = result.queryStatement;

  switch (result.currentState) {
    case "SUCCEEDED": {
      draft.json.nextNodeKey = "Function#5";
      break;
    }
    case "QUEUED":
    case "CANCELED":
    case "RUNNING": {
      draft.json.terminateFlow = true;
      break;
    }
    default: {
      draft.json.terminateFlow = true;
      break;
    }
  }
};
