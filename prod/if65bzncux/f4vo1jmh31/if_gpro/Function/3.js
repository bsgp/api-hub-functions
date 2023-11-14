module.exports = async (draft, { fn, restApi }) => {
  const { ifObj } = draft.json;

  switch (ifObj.InterfaceId) {
    case "IF-FI-004":
      try {
        const token = await fn.getToken({ restApi });
        const result = fn.reverseFiDocument(token, ifObj.Data, { restApi });

        if (result) {
          draft.response.body = {
            E_STATUS: "S",
            E_MESSAGE: "성공",
            RESULT: result,
            ...result,
          };
        } else {
          draft.response.body = {
            E_STATUS: "E",
            E_MESSAGE: "실패",
            RESULT: result,
          };
        }
      } catch (ex) {
        draft.response.body = {
          E_STATUS: "E",
          E_MESSAGE: [ex.message, ex.description].filter(Boolean).join(" "),
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
