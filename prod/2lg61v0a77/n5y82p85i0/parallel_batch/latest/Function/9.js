module.exports = async (draft, { request, lib }) => {
  const { isFalsy, dayjs, clone } = lib;

  // if (request.body.InParallel === true) {
  draft.json.action = "MultipleBatch";

  const withoutRangeField = request.body.WithoutRangeField;
  const rangeField = request.body.RangeField;
  if (isFalsy(rangeField)) {
    if (withoutRangeField === true) {
      // pass
    } else {
      draft.response.body = {
        errorMessage: "RangeField is required",
      };
      draft.json.terminateFlow = true;
      return;
    }
  }

  if (withoutRangeField === true) {
    draft.json.action = "SingleBatch";
    return;
  }

  if (request.body.Columns) {
    if (request.body.Columns.includes(rangeField)) {
      // pass
    } else if (withoutRangeField === true) {
      // pass
    } else {
      draft.response.body = {
        errorMessage: "Range Field가 Columns에 없습니다",
      };
      draft.json.terminateFlow = true;
      return;
    }
  }

  const columnsList = draft.response.body.list;
  const column = columnsList.find((each) => each.fieldName === rangeField);
  if (!column) {
    draft.response.body = {
      errorMessage: "Range Field가 Columns에 없습니다",
    };
    draft.json.terminateFlow = true;
    return;
  }

  if (column.dataType !== "DATS") {
    draft.response.body = {
      errorMessage: "Range Field는 DATS(날짜)유형이 되어야 합니다",
    };
    draft.json.terminateFlow = true;
    return;
  }

  const rangeCondition = request.body.Options.find(
    (each) => each.fieldName === rangeField
  );
  if (isFalsy(rangeCondition)) {
    draft.response.body = {
      errorMessage: "검색조건에 Range Field로 포함되어야 합니다",
    };
    draft.json.terminateFlow = true;
    return;
  }

  draft.json.rangeCondition = clone(rangeCondition);

  if (isFalsy(rangeCondition.value)) {
    draft.response.body = {
      errorMessage: "The value from condition is required",
    };
    draft.json.terminateFlow = true;
    return;
  }

  if (isFalsy(rangeCondition.valueTo)) {
    draft.json.action = "SingleBatch";
    return;
  }

  const dateFrom = dayjs(rangeCondition.value, "YYYYMMDD");
  const dateTo = dayjs(rangeCondition.valueTo, "YYYYMMDD");

  if (!dateFrom.isValid()) {
    draft.response.body = {
      errorMessage: "The value from condition is not valid",
    };
    draft.json.terminateFlow = true;
    return;
  }
  if (!dateTo.isValid()) {
    draft.response.body = {
      errorMessage: "The valueTo from condition is not valid",
    };
    draft.json.terminateFlow = true;
    return;
  }

  const diffDays = dateTo.diff(dateFrom, "day");
  if (diffDays === 0) {
    draft.json.action = "SingleBatch";
    return;
  }
  if (diffDays < 0) {
    draft.response.body = {
      errorMessage: "'From' is higher than 'To' in Range",
    };
    draft.json.terminateFlow = true;
    return;
  }
  // } else {
  //   draft.json.action = "SingleBatch";

  //   if (isFalsy(request.body.BatchName)) {
  //     draft.response.body = {
  //       errorMessage: "BatchName is required",
  //     };
  //     draft.json.terminateFlow = true;
  //     return;
  //   }
  // }
};
