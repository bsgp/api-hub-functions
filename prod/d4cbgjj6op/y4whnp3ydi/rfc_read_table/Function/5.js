module.exports = async (draft) => {
  const { result } = draft.response.body;
  const fields = result.FIELDS.map((each) => {
    each.OFFSET = parseInt(each.OFFSET, 10);
    each.LENGTH = parseInt(each.LENGTH, 10);
    each.END = each.OFFSET + each.LENGTH;
    return each;
  });
  result.DATA = result.DATA.map(({ WA }) =>
    fields.reduce((acc, each) => {
      try {
        acc[each.FIELDNAME] = WA.substring(each.OFFSET, each.END).trim();
      } catch (exx) {
        acc[each.FIELDNAME] = "";
      }
      return acc;
    }, {})
  );
};
