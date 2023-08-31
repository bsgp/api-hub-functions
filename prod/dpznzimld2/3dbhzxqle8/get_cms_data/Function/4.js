module.exports = async (draft, { file }) => {
  const path = [`cms/setting_config/ledgerList.json`].join("");
  let items;
  try {
    const savedDataStr = await file.get(path);
    const savedData = JSON.parse(savedDataStr);
    items = savedData.items;
  } catch (error) {
    draft.response.body.error = error.message;
    items = [];
  }
  draft.response.body = { ...draft.response.body, items };
};
