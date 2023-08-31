module.exports = async (draft, { request, file }) => {
  // your script
  const body = request.body;
  const data = body.Data;

  const link = await file.getUrl(data);

  draft.response.body = {
    data,
    link,
  };
  draft.response.statusCode = 200;
};
