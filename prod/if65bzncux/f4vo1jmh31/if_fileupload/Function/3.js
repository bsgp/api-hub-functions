module.exports = async (draft, { request, file, env }) => {
  const { path } = request.body.Data.file;

  const link = await file.getUrl(path, { stage: env.CURRENT_ALIAS });

  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "get url successfully",
    link,
  };
};
