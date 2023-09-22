module.exports = async (draft, { request, file }) => {
  const { path } = request.body.Data.file;

  const link = await file.getUrl(path, {
    exactPath: true,
    returnBuffer: true,
  });

  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "get url successfully",
    link,
  };
};
