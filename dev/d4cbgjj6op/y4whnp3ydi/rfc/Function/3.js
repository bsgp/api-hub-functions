module.exports = async (draft, { request, lib }) => {
  draft.json.connection = {
    ashost: "10.85.115.190",
    sysnr: "00",
    client: "100",
    user: "IF_EAI",
    passwd: "Dnamotors1!",
    lang: "ko",
  };

  draft.response.body = lib.tryit(() => request.body, "f");
};
