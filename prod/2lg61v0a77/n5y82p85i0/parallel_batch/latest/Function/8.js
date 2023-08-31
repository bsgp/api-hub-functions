module.exports = async (draft, { request, lib, loop }) => {
  const { clone, dayjs } = lib;
  const DATE_FORMAT = "YYYYMMDD";

  const dateFrom = dayjs(draft.json.rangeCondition.value, DATE_FORMAT);
  const dateTo = dayjs(draft.json.rangeCondition.valueTo, DATE_FORMAT);

  const newDate = dateFrom.add(loop.index, "day");

  if (newDate.isAfter(dateTo)) {
    draft.json.breakLoop = true;
    return;
  }

  draft.json.reqBody = clone(request.body);
  //221006 relativeType이 있을 경우 request body에 계산된 value와 valueTo 값으로 업데이트

  if (draft.json.reqBody.RelativeType) {
    const [condition] = draft.json.reqBody.Options;
    condition.value = draft.json.rangeCondition.value;
    condition.valueTo = draft.json.rangeCondition.valueTo;
    condition.RelativeType = draft.json.reqBody.RelativeType;
    condition.RelativeNumber = draft.json.reqBody.RelativeNumber;
  }

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
