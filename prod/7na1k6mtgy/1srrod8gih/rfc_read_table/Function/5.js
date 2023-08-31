module.exports = async (draft) => {
  const { result, errorMessage } = draft.response.body;
  if (errorMessage) {
    return;
  }
  const fields = result.FIELDS.map((each) => {
    each.OFFSET = parseInt(each.OFFSET, 10);
    each.LENGTH = parseInt(each.LENGTH, 10);
    each.END = each.OFFSET + each.LENGTH;
    return each;
  });
  const reLastDash = /-{1}$/;
  draft.response.body.result.DATA = result.DATA.map(({ WA }) =>
    fields.reduce((acc, each) => {
      try {
        acc[each.FIELDNAME] = WA.substring(each.OFFSET, each.END).trim();
        if (["P", "X", "F"].includes(each.TYPE)) {
          if (reLastDash.test(acc[each.FIELDNAME])) {
            acc[each.FIELDNAME] = [
              "-",
              acc[each.FIELDNAME].replace(reLastDash, ""),
            ].join("");
          }
        }
      } catch (exx) {
        acc[each.FIELDNAME] = "";
      }
      return acc;
    }, {})
  );
};
