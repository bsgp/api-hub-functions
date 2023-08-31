module.exports = async (draft, { lib }) => {
  const { tryit } = lib;
  const fields = draft.pipe.json.FIELDS;
  const MaterialRes = draft.pipe.json.Materials;
  const matData = tryit(() => MaterialRes.body.result.DATA, []);
  const materials = tryit(
    () =>
      matData.map((mat) => {
        const matObj = {};
        mat.WA.split("|").forEach((item, idx) => {
          matObj[fields[idx].id] = item.replace(/(^\s+)|(\s+$)/g, "") || " ";
        });
        return matObj;
      }),
    []
  );
  const conversionData = draft.pipe.json.conversion || [];

  const conversionByDate = conversionData
    .map((item) => {
      const fMaterial = materials.find((mat) => mat.MATERIAL === item.MATERIAL);
      return {
        ...item,
        PO_ITEM: tryit(() => item.PO_ITEM.replace(/^0*/, ""), ""),
        MATERIAL: tryit(() => item.MATERIAL.replace(/^0*/, ""), ""),
        SHORT_TEXT: fMaterial ? fMaterial.SHORT_TEXT : "",
        IS_RETURN: item.MOVE_TYPE === "161",
      };
    })
    .sort((al, be) => Number(al.PSTNG_DATE) - Number(be.PSTNG_DATE));

  const findFn = (al, be) =>
    al.PO_NUMBER === be.PO_NUMBER && al.PO_ITEM === be.PO_ITEM;

  const conversionByOrder = conversionByDate
    .filter(
      (it, idx) => conversionByDate.findIndex((cv) => findFn(cv, it)) === idx
    )
    .map((item) => {
      let IS_RETURN = false;
      const QUANTITY = conversionByDate
        .filter((cv) => findFn(cv, item))
        .reduce((acc, curr) => {
          if (curr.MOVE_TYPE === "161") {
            IS_RETURN = true;
          }
          if (curr.QUANTITY) {
            return acc + curr.QUANTITY;
          } else return acc;
        }, 0);
      return { ...item, IS_RETURN, QUANTITY };
    })
    .filter((item) => item.QUANTITY !== 0)
    .sort((al, be) => Number(al.PO_NUMBER) - Number(be.PO_NUMBER));
  const conversion = { total: conversionByOrder, each: conversionByDate };
  draft.response.body = { ...draft.response.body, conversion, materials };
};
