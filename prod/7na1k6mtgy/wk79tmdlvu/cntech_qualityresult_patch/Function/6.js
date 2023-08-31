module.exports = async (draft, { file, lib }) => {
  const { tryit } = lib;
  const isExist = draft.json.isExist;
  if (!isExist) {
    return;
  }

  const patchResult = draft.json.patchResult;
  const patch = draft.json.patch;
  const nextPatch = Number(patch) + 100;
  let checkPatchRes = true;
  if (patchResult.length === 0) {
    await file.upload("/cntech/my349266/patch.txt", nextPatch, { gzip: true });
    await file.move(
      `/cntech/my349266/changed/${patch}.js`,
      `/cntech/my349266/result/noChanged/${patch}.js`
    );
  } else {
    checkPatchRes = patchResult.reduce((acc, curr) => {
      if (tryit(() => curr.patchResult.statusCode) !== 204) {
        acc = false;
        return acc;
      }
      return true;
    }, true);
    if (checkPatchRes) {
      await file.upload("/cntech/my349266/patch.txt", nextPatch, {
        gzip: true,
      });
      await file.move(
        `/cntech/my349266/changed/${patch}.js`,
        `/cntech/my349266/result/Changed/${patch}.js`
      );
    } else {
      await file.upload("/cntech/my349266/patch.txt", nextPatch, {
        gzip: true,
      });
      await file.move(
        `/cntech/my349266/changed/${patch}.js`,
        `/cntech/my349266/result/failed/${patch}.js`
      );
    }
  }

  draft.response.body = {
    ...draft.response.body,
    checkPatchRes,
    result: "success",
    patch,
  };
};
