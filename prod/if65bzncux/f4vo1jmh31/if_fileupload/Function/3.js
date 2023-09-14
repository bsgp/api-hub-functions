module.exports = async (draft, { request, file }) => {
  draft.response.body = await Promise.all(
    (request.body.data.files || []).map(async (fileData) => {
      const { tempFilePath, fileType, path } = fileData;
      const data = await file.get(tempFilePath, {
        exactPath: true,
        returnBuffer: true,
      });
      const fileResponse = await file.upload(path, data, {
        contentType: fileType,
      });
      return fileResponse;
    })
  );
};
