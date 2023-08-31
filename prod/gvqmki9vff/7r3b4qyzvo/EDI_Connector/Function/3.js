module.exports = async (draft, { file }) => {
  const path = draft.pipe.json.path;
  const files = draft.pipe.json.files || [];
  const moveData = files.map((item) => ({
    moveFrom: item,
    moveTo: item.includes("/202")
      ? item
      : item.replace(/FROM_OpenText_done/, "FROM_OpenText_done/past"),
  }));
  await Promise.all(
    moveData.map(async (item) => {
      return await file.move(item.moveFrom, item.moveTo);
    })
  );
  const afterChange = await file.list(path);
  draft.response.body = { afterChange, moveData };
};
