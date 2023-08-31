module.exports = async (draft, { env, file, log }) => {
  const payload = draft.json.payload;

  const path = `config/srm/${env.BYD_TENANT}.json`;
  const uploadConfig = await file.upload(path, payload, {
    gzip: true,
  });
  log("upload tables config:", uploadConfig);

  draft.response.body = {
    ...draft.response.body,
    payload,
    path,
  };
};
