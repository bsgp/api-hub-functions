module.exports = async (draft, { log, tryit }) => {
  const { result } = draft.pipe.json;

  if (result.errorMessage) {
    const eBlocked = (() => {
      if (result.code === "existing") {
        if (result.blocked === true) {
          return "X";
        } else {
          return "";
        }
      }
      return undefined;
    })();
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: result.errorMessage,
      E_BLOCKED: eBlocked,
    };
  } else {
    if (tryit(() => draft.response.body.E_STATUS) === "S") {
      // pass
    } else {
      log.error(result);
      draft.response.body = {
        E_STATUS: "F",
        E_MESSAGE: ["오류 발생", result.toString()].join(" "),
      };
    }
  }
};
