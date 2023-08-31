module.exports = async (draft, { file }) => {
  // your script
  const target = 100;
  await file.upload("/cntech/my349266/patch.txt", target, { gzip: true });
  await file.move(
    `/cntech/my349266/result/noChanged/${target}.js`,
    `/cntech/my349266/changed/${target}.js`
  );
  draft.response.body = { result: "moved" };
};
