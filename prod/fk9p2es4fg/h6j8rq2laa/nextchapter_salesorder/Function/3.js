module.exports = async (draft, { odata, env, file }) => {
  draft.response.body = {};
  const response = await odata.get({
    url: "https://api.tonextchapter.com/api/sap/orders",
    headers: {
      Authorization: env.AUTH_TOKEN,
    },
  });
  await file.upload("backup/salesorder", response);
  draft.json.response = response;
  draft.response.body = { ...draft.response.body, response };
};
