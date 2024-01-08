module.exports = async (draft, { request }) => {
  const routeTo = {
    exit: "Output#2",
    _if: "Function#4",
    config: "Function#5",
  };

  const setFailedResponse = (msg, status = 400) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = status;
    draft.json.nextNodeKey = routeTo.exit;
  };

  const [suffix] = request.path.split("/").reverse();

  switch (suffix) {
    case "if":
      draft.json.nextNodeKey = routeTo._if;
      break;
    case "config":
      draft.json.nextNodeKey = routeTo.config;
      break;
    default:
      setFailedResponse(`${request.path} is not invalid api`);
      break;
  }
};
