module.exports = async (draft, { request, lib }) => {
  const { isFalsy, dayjs, clone, kst } = lib;

  draft.json.reqBody = clone(request.body);

  // if (draft.json.reqBody.InParallel === true) {
  draft.json.action = "MultipleBatch";

  const withoutRangeField = draft.json.reqBody.WithoutRangeField;
  const rangeField = draft.json.reqBody.RangeField;
  const rangeFormat = draft.json.reqBody.RangeFormat;

  const DATE_FORMAT = rangeFormat || "YYYYMMDD";
  // {
  //   Options: [
  //     {
  //       value:
  //       valueTo:
  //       isRelative:
  //       relativeNumber:
  //       relativeType:
  //     }]
  // }

  // TODO: line 12 ~ line 25 변경된 옵션 originQuery에 업데이트
  draft.json.reqBody.Options = draft.json.reqBody.Options.map((option) => {
    const { relativeType, relativeNumber, isRelative } = option;
    if (isRelative === true) {
      const dateType = relativeType.toLowerCase();
      const dateTo = kst.format(DATE_FORMAT);
      const dateFrom = dayjs(dateTo, DATE_FORMAT)
        .subtract(relativeNumber, dateType)
        .format(DATE_FORMAT);

      return { ...option, value: dateFrom, valueTo: dateTo };
    }
    console.log(option, "function9 option", rangeFormat);
    return option;
  });
  // TODO: originQuery 업데이트
  draft.json.ds.originQuery.Options = clone(draft.json.reqBody.Options);
  console.log(JSON.stringify(draft.json.ds), "check originQuery");
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
    if (!rangeFormat) {
      throw new Error(
        [
          "Range Field가 DATS(날짜)유형이 아닐때에는",
          "Range Format이 반드시 지정되어야 합니다",
        ].join(" ")
      );
    }
  }

  if (draft.json.reqBody.Columns) {
    if (draft.json.reqBody.Columns.includes(rangeField)) {
      // pass
    } else if (withoutRangeField === true) {
      // pass
    } else {
      /*
      draft.response.body = {
        errorMessage: "Range Field가 Columns에 없습니다",
      };
      draft.json.terminateFlow = true;
      return;
      */
      draft.json.reqBody.Columns.push(rangeField);
      draft.json.ds.originQuery.Columns.push(rangeField);
    }
  }

  const rangeCondition = draft.json.reqBody.Options.find(
    (each) => each.fieldName === rangeField
  );

  if (isFalsy(rangeCondition)) {
    throw new Error("검색조건에 Range Field도 포함되어야 합니다");
  }

  draft.json.rangeCondition = clone(rangeCondition);

  // TODO: origin

  // const { RelativeNumber: relativeNumber, RelativeType: relativeType } =
  //   draft.json.reqBody;
  // if (relativeType) {
  //   const newRelativeType = relativeType.toLowerCase();

  //   const dateTo = dayjs().format("YYYYMMDD");
  //   const dateFrom = dayjs(dateTo)
  //     .subtract(relativeNumber, newRelativeType)
  //     .format("YYYYMMDD");

  //   draft.json.rangeCondition.value = dateFrom;
  //   draft.json.rangeCondition.valueTo = dateTo;

  // const originRangeCondition = draft.json.ds.originQuery.Options.find(
  //   (each) => each.fieldName === rangeField
  // );
  // originRangeCondition.value = dateFrom;
  // originRangeCondition.valueTo = dateTo;

  // const updateItem = draft.json.reqBody.Options.find(
  //   (each) => each.fieldName === rangeField
  // );

  // originRangeCondition.value = updateItem.value;
  // originRangeCondition.valueTo = updateItem.valueTo;

  // }
  // 221015 value, valueTo를 validate하기전에 환산 완료

  if (isFalsy(draft.json.rangeCondition.value)) {
    throw new Error("The value from condition is required");
  }

  if (isFalsy(draft.json.rangeCondition.valueTo)) {
    draft.json.action = "SingleBatch";
    return;
  }

  const dateFrom = dayjs(draft.json.rangeCondition.value, DATE_FORMAT);
  const dateTo = dayjs(draft.json.rangeCondition.valueTo, DATE_FORMAT);

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

  //   if (isFalsy(draft.json.reqBody.BatchName)) {
  //     draft.response.body = {
  //       errorMessage: "BatchName is required",
  //     };
  //     draft.json.terminateFlow = true;
  //     return;
  //   }
  // }
};
