module.exports = async (draft, { file, lib }) => {
  // your script
  const { tryit } = lib;
  const patchData = await tryit(() =>
    file.get(`/cntech/my349266/patch.txt`, { gziped: true })
  );
  const patch = patchData || 0;
  try {
    const fileData = await file.get(`cntech/my349266/changed/${patch}.js`, {
      gziped: true,
    });
    const fileParse = JSON.parse(fileData);

    draft.json.patch = patch;
    draft.json.fileParse = fileParse;
    draft.response.body = { fileParse };
  } catch (error) {
    const isExist = false;
    draft.json.isExist = isExist;
    draft.response.body = {
      message: error.message,
    };
  }
};
