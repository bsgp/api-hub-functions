module.exports = async (draft, { odata }) => {
  const result = await odata.get({
    url: [
      "https://my349266.sapbydesign.com/sap/byd/odata/cust/v1/",
      "bsg_identified_stock/IdentifiedStockCollection",
      "?",
      "$filter=( ID eq 'BE0FE7' )",
      "&sap-language=ko&$format=json",
      "&$inlinecount=allpages",
    ].join(""),
    username: "admin",
    password: "Welcome12",
  });

  draft.response.body = result;
};
