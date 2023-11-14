module.exports = async (draft, { fn, restApi }) => {
  const { ifObj } = draft.json;

  switch (ifObj.InterfaceId) {
    case "IF-FI-004":
      try {
        const token = await fn.getToken({ restApi });
        fn.cancelFiDocument(token, {}, { restApi });
      } catch (ex) {
        draft.response.body = {
          E_STATUS: "E",
          E_MESSAGE: [ex.message, ex.errorDescription]
            .filter(Boolean)
            .join(" "),
        };
      }

      break;
    default:
      draft.response.body = {
        E_STATUS: "E",
        E_MESSAGE: "Can not recognize this Interface ID",
      };
      break;
  }
};
