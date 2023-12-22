module.exports = async (draft, { request, env, restApi, fn }) => {
  // const params = new URLSearchParams();
  // params.set("bukrs", "2000");
  // params.set("date_from", "20220801");
  // params.set("date_to", "20220831");
  // params.set("dctyp", "BZM01");
  // const queryString = params.toString();
  const unipostURL =
    env.CURRENT_ALIAS === "prd"
      ? "https://cont.unipost.co.kr"
      : "https://contdev.unipost.co.kr";

  const opt = { restApi, unipostURL };
  const secretKey = await fn.getSecretKey(opt);

  switch (draft.json.ifObj.InterfaceId) {
    case "IF-CT-007": {
      const result = await fn.getTemplateList(secretKey, opt);
      draft.response.body = { E_STATUS: "S", list: result };
      break;
    }
    case "IF-CT-008": {
      const contNo = request.body.Data.ContNo;
      const token = await fn.getTokenForWork(secretKey, { ...opt, contNo });

      draft.response.body = { E_STATUS: "S", unipostURL, token };
      break;
    }
    case "IF-CT-009": {
      const contNo = request.body.Data.ContNo;
      const token = await fn.getTokenForRead(secretKey, { ...opt, contNo });

      draft.response.body = { E_STATUS: "S", unipostURL, token };
      break;
    }
    default:
      break;
  }
};
