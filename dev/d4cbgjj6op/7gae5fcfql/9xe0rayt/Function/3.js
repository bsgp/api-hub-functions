module.exports = async (draft, { request, rfc }) => {
  await rfc
    .invoke("ZFI_XX_XX", request.params)
    .then((data) => data)
    .catch((ex) => {
      console.log(ex);
    });

  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "ZFI_XX_XX done",
  };
};
