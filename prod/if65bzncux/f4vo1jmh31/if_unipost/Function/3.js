module.exports = async (draft, { restApi, fn }) => {
  // const params = new URLSearchParams();
  // params.set("bukrs", "2000");
  // params.set("date_from", "20220801");
  // params.set("date_to", "20220831");
  // params.set("dctyp", "BZM01");
  // const queryString = params.toString();

  const secretKey = await fn.getSecretKey({ restApi });

  switch (draft.json.ifObj.InterfaceId) {
    case "IF-CT-007":
      {
        // const result = await fn.getTemplateList(secretKey, { restApi });
        const result = await fn.getTemplateList(
          "sLaY2H78oAI+ydiDVF7oE/MkmTG5Ay3niqgiWriJ7r3Nr+xkFYx5/JKpUMz/Si8b",
          { restApi }
        );
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
