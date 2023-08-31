module.exports = async (draft, context) => {
  const { request, file } = context;
  const { file: fileData, type, path } = request.body;
  const fileResponse = await file.upload(path, fileData, {
    contentType: type,
  });
  if (!fileResponse) {
    return (draft.response.body = {
      E_STATUS: "F",
      statusCode: 400,
      E_MESSAGE: "file upload failed",
    });
  }

  return (draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "saved successfully",
  });
};
