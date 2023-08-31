module.exports = async (draft, { lib, dynamodb, request, fn }) => {
  const { dayjs, clone } = lib;
  const rangeFormat = draft.json.reqBody.RangeFormat;

  const DATE_FORMAT = rangeFormat || "YYYYMMDD";

  // const data = await dynamodb.getItem("etl_ds", {
  //   tb: draft.json.ds.table,
  //   id: draft.json.ds.dataset,
  // });

  const dateFrom = dayjs(draft.json.ds.lastRangeValue, DATE_FORMAT);
  const dateTo = dayjs(draft.json.ds.rangeCondition.valueTo, DATE_FORMAT);

  const newDate = dateFrom.add(1, fn.getDayUnit(DATE_FORMAT));
  if (newDate.isAfter(dateTo)) {
    draft.json.terminateFlow = true;
    return;
  }

  draft.json.ds.lastRangeValue = newDate.format(DATE_FORMAT);

  draft.json.reqBody = clone(request.body);
  draft.json.reqBody.Options = clone(draft.json.ds.originQuery.Options);

  const rangeField = draft.json.reqBody.RangeField;
  const rangeCondition = draft.json.reqBody.Options.find(
    (each) => each.fieldName === rangeField
  );

  delete rangeCondition.valueTo;
  rangeCondition.value = newDate.format(DATE_FORMAT);

  draft.json.reqBody.BatchName = [
    draft.json.ds.version,
    rangeCondition.value,
  ].join("_");

  // await file.upload(draft.json.dataSetPath, data, { gzip: true });
  await dynamodb.updateItem(
    "etl_ds",
    {
      tb: draft.json.ds.table,
      id: draft.json.ds.dataset,
    },
    {
      lastRangeValue: draft.json.ds.lastRangeValue,
      [dynamodb.LOCKKEY]: draft.json.ds[dynamodb.LOCKKEY],
    },
    {
      retryWhenLocked: true,
    }
  );
};
