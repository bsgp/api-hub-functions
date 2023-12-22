module.exports = async (draft, { request, env, restApi, fn }) => {
  // const params = new URLSearchParams();
  // params.set("bukrs", "2000");
  // params.set("date_from", "20220801");
  // params.set("date_to", "20220831");
  // params.set("dctyp", "BZM01");
  // const queryString = params.toString();

  const stage = env.CURRENT_ALIAS;
  const unipostURL =
    stage === "prd"
      ? "https://cont.unipost.co.kr"
      : "https://contdev.unipost.co.kr";
  const secretKey = await fn.getSecretKey({ restApi });

  switch (draft.json.ifObj.InterfaceId) {
    case "IF-CT-007":
      {
        const result = await fn.getTemplateList(secretKey, {
          restApi,
          unipostURL,
        });
        draft.response.body = {
          E_STATUS: "S",
          list: result,
        };
      }
      break;
    case "IF-CT-008":
      {
        const token = await fn.getTokenForWork(secretKey, {
          restApi,
          unipostURL,
          contNo: request.body.Data.ContNo,
        });
        draft.response.body = {
          E_STATUS: "S",
          unipostURL,
          token,
        };
      }
      break;
    case "IF-CT-009":
      {
        const token = await fn.getTokenForRead(secretKey, {
          restApi,
          unipostURL,
          contNo: request.body.Data.ContNo,
        });
        draft.response.body = {
          E_STATUS: "S",
          unipostURL,
          token,
        };
      }
      break;
    default:
      break;
  }
};
