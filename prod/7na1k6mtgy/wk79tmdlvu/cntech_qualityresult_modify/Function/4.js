module.exports = async (draft, { lib }) => {
  const { tryit } = lib;
  const isExist = draft.json.isExist;
  if (!isExist) {
    return;
  }
  const results = draft.json.results;
  const parseData = await Promise.all(
    results.map((item) => {
      const QC_REPORT_KUT = tryit(() => JSON.parse(item.QC_REPORT_KUT));
      return { ...item, QC_REPORT_KUT };
    })
  );

  draft.json.parseData = parseData;
  draft.response.body = { parseData };
};
