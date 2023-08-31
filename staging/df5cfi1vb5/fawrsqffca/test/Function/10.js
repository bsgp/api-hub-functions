module.exports = async (draft, { file }) => {
  await file.upload("copy/test", "test");
  await file.move("copy/test", "move/test");
  const copyExists = await file.exist("copy/test");
  const moveExists = await file.exist("move/test");

  draft.response.body = {
    copyExists,
    moveExists,
  };
};
