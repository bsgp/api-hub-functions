module.exports = async (draft, { request, file }) => {
  const uploadResult = await Promise.all(
    (request.body.Data.files || []).map(async (fileData) => {
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
  if (uploadResult.find((res) => !res)) {
    draft.response.body = {
      E_STATUS: "F",
      E_MESSAGE: "FileUpload failed",
      uploadResult,
    };
  } else {
    draft.response.body = {
      E_STATUS: "S",
      E_MESSAGE: "FileUpload succeed",
      uploadResult,
    };
  }
};
