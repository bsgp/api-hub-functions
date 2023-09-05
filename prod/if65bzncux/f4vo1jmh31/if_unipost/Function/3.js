module.exports = async (draft, { restApi, tryit, fn }) => {
  // const params = new URLSearchParams();
  // params.set("bukrs", "2000");
  // params.set("date_from", "20220801");
  // params.set("date_to", "20220831");
  // params.set("dctyp", "BZM01");
  // const queryString = params.toString();

  const secretKey = await fn.getSecretKey({ restApi, tryit });

  const result = await restApi.post({
    url: [
      "https://contdev.unipost.co.kr/unicloud/cont/api/getContUserToken",
    ].join("?"),
    headers: {
      secretKey,
    },
    body: {
      usId: "bsg_cont_work01",
    },
  });

  draft.response.body = {
    secretKey,
    result,
  };
};
