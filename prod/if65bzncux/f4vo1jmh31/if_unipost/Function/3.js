module.exports = async (draft, { restApi, tryit, fn }) => {
  // const params = new URLSearchParams();
  // params.set("bukrs", "2000");
  // params.set("date_from", "20220801");
  // params.set("date_to", "20220831");
  // params.set("dctyp", "BZM01");
  // const queryString = params.toString();

  const secretKey = await fn.getSecretKey({ restApi, tryit });

  const token = await fn.getTokenForWork(secretKey, { restApi, tryit });

  const result = await fn.getTemplateList();

  draft.response.body = {
    secretKey,
    token,
    result,
  };
};
