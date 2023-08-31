module.exports = async (draft, { request, file }) => {
  // your script
  const { path } = request.params;
  if (!path) {
    console.log("Empty file path");
    draft.response.body.E_STATUS = "F";
    draft.response.body.E_MESSAGE = "file path 들어오지 않음";
    return;
  }
  const url = await file.getUrl(path);
  draft.response.body = {
    E_STATUS: "S",
    E_MESSAGE: "Get successfully",
    url: url,
  };
};
