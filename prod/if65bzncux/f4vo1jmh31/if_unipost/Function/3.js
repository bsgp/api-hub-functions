module.exports = async (draft, { restApi }) => {
  // const params = new URLSearchParams();
  // params.set("bukrs", "2000");
  // params.set("date_from", "20220801");
  // params.set("date_to", "20220831");
  // params.set("dctyp", "BZM01");
  // const queryString = params.toString();

  const result = await restApi.post({
    url: ["https://contdev.unipost.co.kr/unicloud/cont/api/getSecretKey"].join(
      "?"
    ),
    headers: {
      clientKey: "51147370C5A742709F3EB95213CFBE30",
    },
  });

  draft.response.body = result;
};
