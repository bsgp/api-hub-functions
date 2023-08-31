module.exports = async (draft, { request, file }) => {
  const path = [`cms/setting_config/${request.params.type}.json`].join("");
  const data = JSON.stringify(request.body);
  await file.upload(path, data, { gziped: true });
  const savedDataStr = await file.get(path);
  const savedData = JSON.parse(savedDataStr);
  draft.response.body = {
    ...draft.response.body,
    savedData,
    message: "저장되었습니다.",
    type: "S",
  };
};
