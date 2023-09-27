module.exports = async (draft, { restApi, fn }) => {
  // const params = new URLSearchParams();
  // params.set("bukrs", "2000");
  // params.set("date_from", "20220801");
  // params.set("date_to", "20220831");
  // params.set("dctyp", "BZM01");
  // const queryString = params.toString();

  const secretKey = await fn.getSecretKey({ restApi });
  // const secretKey2 = await restApi.post({
  //   url: [
  //     "https://contdev.unipost.co.kr/unicloud/cont/api/getSecretKey",
  //   ].join("?"),
  //   headers: {
  //     clientKey: "51147370C5A742709F3EB95213CFBE30",
  //   },
  // });
  // draft.response.body = {
  //   secretKey2,
  // };

  switch (draft.json.ifObj.InterfaceId) {
    case "IF-CT-007":
      {
        const result = await fn.getTemplateList(secretKey, { restApi });

        draft.response.body = {
          list: result,
        };
      }
      break;
    case "IF-CT-008":
      {
        const token = await fn.getTokenForWork(secretKey, { restApi });
        draft.response.body = {
          token,
        };
      }
      break;
    case "IF-CT-009":
      {
        const token = await fn.getTokenForRead(secretKey, { restApi });
        draft.response.body = {
          token,
        };
      }
      break;
    default:
      break;
  }
};
