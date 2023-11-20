module.exports = async (draft, { fn, restApi }) => {
  const { ifObj } = draft.json;

  switch (ifObj.InterfaceId) {
    case "IF-CT-003":
      try {
        const token = await fn.getToken({ restApi });
        const result = await fn.getOrganizationsList(token, {
          restApi,
        });

        draft.response.body = {
          E_STATUS: "S",
          E_MESSAGE: "성공",
          GPRO: result,
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
