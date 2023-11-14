module.exports = async (draft, { fn, request, restApi }) => {
  const { ifObj } = draft.json;

  switch (ifObj.InterfaceId) {
    case "IF-FI-004":
      try {
        const token = await fn.getToken({ restApi });
        const result = await fn.reverseFiDocument(token, request.body.Data, {
          restApi,
        });

        draft.response.body = {
          E_STATUS: "S",
          E_MESSAGE: "성공",
          ...result,
        };
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
