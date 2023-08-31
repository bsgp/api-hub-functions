module.exports = async (draft, { request, lib }) => {
  const { clone, isFalsy, dayjs } = lib;
  const withoutRangeField = request.body.WithoutRangeField;
  const rangeField = request.body.RangeField;

  let rangeCondition;
  if (isFalsy(rangeField)) {
    const [options] = request.body.Options;
    rangeCondition = clone(options);
  } else {
    rangeCondition = request.body.Options.find(
      (each) => each.fieldName === rangeField
    );
  }

  draft.json.rangeCondition = clone(rangeCondition);
  // 221006 RelativeType & RelativeNumber 를 이용한 자동날짜 계산 로직 추가
  if (request.body.RelativeType) {
    const { RelativeNumber, RelativeType } = request.body;
    const type = RelativeType.toLowerCase();
    const dateTo = dayjs().format("YYYYMMDD");

    let dateFrom;
    if (type === "day") {
      dateFrom = dayjs(dateTo)
        .subtract(RelativeNumber, type)
        .format("YYYYMMDD");
    } else {
      dateFrom = dayjs(dateTo)
        .subtract(RelativeNumber, type)
        .format("YYYYMMDD");
    }

    draft.json.rangeCondition.value = dateFrom;
    draft.json.rangeCondition.valueTo = dateTo;

    /* 20221007
    RelativeType이 있을 경우 originQuery에 value와 valueTo를 
    RelativeNumber와 RelativeType 조건으로 업데이트한 날짜로 업데이트
  */

    const [condition] = draft.json.ds.originQuery.Options;
    condition.value = dateFrom;
    condition.valueTo = dateTo;
    condition.RelativeType = request.body.RelativeType;
    condition.RelativeNumber = request.body.RelativeNumber;
  }

  draft.json.action = "MultipleBatch";

  if (
    isFalsy(draft.json.rangeCondition.valueTo) ||
    withoutRangeField === true
  ) {
    draft.json.action = "SingleBatch";
  }
};
