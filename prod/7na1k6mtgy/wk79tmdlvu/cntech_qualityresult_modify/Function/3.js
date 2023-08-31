module.exports = async (draft, { file, lib }) => {
  // your script
  const { tryit } = lib;
  const targetData = await tryit(() =>
    file.get(`/cntech/my349266/target.txt`, { gziped: true })
  );
  console.log(targetData);
  const target = targetData || 0;
  try {
    const fileData = await file.get(`cntech/my349266/backup/${target}.js`, {
      gziped: true,
    });
    const fileParse = JSON.parse(fileData);
    const count = tryit(() => fileParse.d.__count);
    const results = tryit(() => fileParse.d.results);
    draft.json.target = target;
    draft.json.count = count;
    draft.json.results = results;
  } catch (error) {
    draft.json.isExist = false;
    draft.response.body = {
      message: error.message,
    };
  }
};
