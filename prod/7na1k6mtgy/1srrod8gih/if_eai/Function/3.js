module.exports = async (draft, { request }) => {
  const routeTo = {
    exit: "Output#2",
    configure: "",
    _if: "",
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
    case "configure":
      draft.json.nextNodeKey = routeTo.configure;
      break;
    default:
      setFailedResponse(`${request.path} is not invalid api`);
      break;
  }
};
