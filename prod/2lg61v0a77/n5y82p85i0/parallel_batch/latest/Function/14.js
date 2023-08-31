module.exports = async (draft, { lib, dynamodb, request }) => {
  const { dayjs, clone } = lib;
  const DATE_FORMAT = "YYYYMMDD";

  const dateFrom = dayjs(draft.json.ds.lastRangeValue, DATE_FORMAT);
  const dateTo = dayjs(draft.json.ds.rangeCondition.valueTo, DATE_FORMAT);

  const newDate = dateFrom.add(1, "day");
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

  //await file.upload(draft.json.dataSetPath, data, { gzip: true });

  // 221014  28 line의 변경된 lastRangeValue 업데이트
  draft.json.ds = await dynamodb.updateItem(
    "etl_ds",
    {
      tb: draft.json.ds.table,
      id: draft.json.ds.dataset,
    },
    draft.json.ds
  );

  const bverData = await dynamodb.getItem("etl_bver", {
    tbds: [draft.json.ds.table, draft.json.ds.dataset].join("/"),
    id: draft.json.ds.version,
  });

  await dynamodb.updateItem(
    "etl_bver",
    {
      tbds: [draft.json.ds.table, draft.json.ds.dataset].join("/"),
      id: draft.json.ds.version,
    },
    { ...draft.json.ds, lOcKkEy: bverData && bverData.lOcKkEy }
  );
};
