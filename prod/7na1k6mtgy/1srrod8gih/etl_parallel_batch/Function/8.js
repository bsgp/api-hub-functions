module.exports = async (draft, { request, lib, loop, fn }) => {
  const { dayjs } = lib;
  const rangeFormat = request.body.RangeFormat;

  const DATE_FORMAT = rangeFormat || "YYYYMMDD";

  const dateFrom = dayjs(draft.json.rangeCondition.value, DATE_FORMAT);
  const dateTo = dayjs(draft.json.rangeCondition.valueTo, DATE_FORMAT);

  const newDate = dateFrom.add(loop.index, fn.getDayUnit(DATE_FORMAT));
  if (newDate.isAfter(dateTo)) {
    draft.json.breakLoop = true;
    return;
  }

  // draft.json.reqBody = clone(request.body);
  // draft.json.reqBody.InParallel = true;

  const rangeField = request.body.RangeField;
  const rangeCondition = draft.json.reqBody.Options.find(
    (each) => each.fieldName === rangeField
  );

  delete rangeCondition.valueTo;
  rangeCondition.value = newDate.format(DATE_FORMAT);

  draft.json.reqBody.BatchName = [
    draft.json.ds.version,
    rangeCondition.value,
  ].join("_");
  // 	const rangeField = request.body.RangeField;
};
