module.exports = async (draft, { lib, file }) => {
  const { isTruthy } = lib;
  const isExist = draft.json.isExist;
  if (!isExist) {
    return;
  }

  function validateTestResult(testResult, limit) {
    const floatTestResult = parseFloat(testResult);
    if (!isTruthy(testResult) && floatTestResult !== 0) {
      return false;
    } else {
      if (limit.upper.number === 0) {
        if (floatTestResult < limit.lower.number) {
          return false;
        }
      } else {
        if (floatTestResult < limit.lower.number) {
          return false;
        } else if (floatTestResult > limit.upper.number) {
          return false;
        }
      }
    }
    return true;
  }

  const parseData = draft.json.parseData;
  const filterResult = parseData.filter(
    (item) =>
      item.QC_REPORT_KUT &&
      !item.QC_REPORT_KUT.testResult &&
      item.QC_REPORT_KUT.items &&
      item.QC_REPORT_KUT.items.length > 0
  );
  const changedData = filterResult
    .map((istock) => {
      const testResult = istock.QC_REPORT_KUT.items.reduce((acc, each) => {
        if (acc) {
          if (each.hasLimitRange) {
            return validateTestResult(each.testResult, each.limit);
          } else if (!each.testResult) return false;
        }
        return acc;
      }, true);
      if (testResult) {
        const QC_REPORT_KUT = { ...istock.QC_REPORT_KUT, testResult };
        return { ObjectID: istock.ObjectID, ID: istock.ID, QC_REPORT_KUT };
      }
    })
    .filter(Boolean);

  const body = {
    isFalse: { count: filterResult.length, data: filterResult },
    changed: { count: changedData.length, data: changedData },
  };
  const target = draft.json.target;
  const nextTarget = Number(target) + 100;
  await file.upload("/cntech/my349266/target.txt", nextTarget, { gzip: true });
  await file.upload(`/cntech/my349266/changed/${target}.js`, body, {
    gzip: true,
  });
  draft.response.body = { ...body, nextTarget };
};
