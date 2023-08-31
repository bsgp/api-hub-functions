module.exports = async (draft, { rfc }) => {
  // your script

  draft.json.connection = {
    ashost: "52.79.134.180",
    sysnr: "01",
    client: "100",
    user: "KRFC_05",
    passwd: "smartbill1!",
    lang: "ko",
  };

  const result = await rfc.invoke("RFC_READ_TABLE", {}, draft.json.connection, {
    version: "750",
  });

  draft.response.body = { result };
};
