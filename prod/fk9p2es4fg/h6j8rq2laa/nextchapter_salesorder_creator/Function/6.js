module.exports = async (draft, { file, odata, env }) => {
  const fileName = draft.json.fileName;
  if (draft.response.body.E_STATUS !== "S" || !fileName) {
    return;
  }
  await file.move(fileName, `/so_done/created.json`);
  const ids = [Number(fileName.replace(/so\/|\.json/g, ""))];
  const ncResponse = await odata.post({
    url: "https://api.tonextchapter.com/api/sap/orders/processed",
    headers: {
      Authorization: env.AUTH_TOKEN,
      "Content-Type": "application/json",
    },
    body: { ids },
  });
  draft.response.body = {
    ...draft.response.body,
    ncResponse,
    ids,
  };
};
