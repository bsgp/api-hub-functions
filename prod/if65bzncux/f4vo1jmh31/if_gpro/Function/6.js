module.exports = async (draft, { fn, request, restApi, flow }) => {
  const { ifObj } = draft.json;

  switch (ifObj.InterfaceId) {
    case "IF-CO-010-BATCH":
      try {
        const token = await fn.getToken({ restApi });
        const result = await fn.getOrganizationsList(token, {
          restApi,
        });

        const rfcResult = await flow.run({
          id: "if_rfc",
          body: {
            InterfaceId: "IF-CO-010",
            Function: {
              ...request.body.Function,
              SysId: "G_PRO",
              Type: "RFC",
            },
            Data: {
              IT_DATA: result,
            },
          },
        });

        draft.response.body = {
          E_STATUS: "S",
          E_MESSAGE: "성공",
          GPRO: result,
          SAP: rfcResult,
        };
      } catch (ex) {
        draft.response.body = {
          E_STATUS: "E",
          E_MESSAGE: [ex.message, ex.description].filter(Boolean).join(" "),
        };
      }

      break;
    case "IF-CO-011-BATCH":
      try {
        const token = await fn.getToken({ restApi });
        const result = await fn.getEmployeesList(token, {
          restApi,
        });

        const rfcResult = await flow.run({
          id: "if_rfc",
          body: {
            InterfaceId: "IF-CO-011",
            Function: {
              ...request.body.Function,
              SysId: "G_PRO",
              Type: "RFC",
            },
            Data: {
              IT_DATA: result,
            },
          },
        });

        draft.response.body = {
          E_STATUS: "S",
          E_MESSAGE: "성공",
          GPRO: result,
          SAP: rfcResult,
        };
      } catch (ex) {
        draft.response.body = {
          E_STATUS: "E",
          E_MESSAGE: [ex.message, ex.description].filter(Boolean).join(" "),
        };
      }

      break;
    case "IF-CO-035-BATCH":
      try {
        const token = await fn.getToken({ restApi });
        const result = await fn.getAssignmentsList(token, {
          restApi,
        });

        const rfcResult = await flow.run({
          id: "if_rfc",
          body: {
            InterfaceId: "IF-CO-035",
            Function: {
              ...request.body.Function,
              SysId: "G_PRO",
              Type: "RFC",
            },
            Data: {
              IT_DATA: result,
            },
          },
        });

        draft.response.body = {
          E_STATUS: "S",
          E_MESSAGE: "성공",
          GPRO: result,
          SAP: rfcResult,
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
