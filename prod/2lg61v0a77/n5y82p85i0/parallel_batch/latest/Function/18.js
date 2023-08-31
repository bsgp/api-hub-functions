module.exports = async (draft, { request, dynamodb, lib }) => {
  const { clone } = lib;

  const oldData = await dynamodb.getItem("etl_ds", {
    tb: draft.json.ds.table,
    id: draft.json.ds.dataset,
  });

  if (oldData) {
    if (oldData.status !== "Finished") {
      draft.response.body = {
        errorMessage: [
          "Dataset",
          draft.json.ds.dataset,
          "for table",
          draft.json.ds.table,
          "is",
          oldData.status,
        ].join(" "),
      };
      draft.json.terminateFlow = true;
      return;
    }
    if (oldData.version) {
      draft.json.ds.version = Number(oldData.version) + 1;
      draft.json.ds.version = draft.json.ds.version.toString();
    }
  }

  draft.json.ds.startedAt = new Date();
  draft.json.ds.endedAt = "";
  draft.json.ds.status = "Started";
  draft.json.ds.maxConcurrency = 5;

  draft.json.ds.originQuery = {
    WithoutRangeField: request.body.WithoutRangeField,
    RangeField: request.body.RangeField,
    Options: clone(request.body.Options),
    Columns: clone(request.body.Columns),
  };

  switch (request.method) {
    case "TASK": {
      /* 20221006 
      초기 의도는 updateItem 전 getItem으로 draft.json.ds를 초기화 하는 로직이 있어
      version을 업데이트 하여도 초기화 값으로 적용이 되어 덮어쓰는 로직이 필요했음
      하지만 1005에 getItem시 모든 값을 덮어 씌어주는 것이 아닌 
      업데이트 시 필요한 lockkey만 업데이트 해주는 로직으로
      변경하여 더 이상 line에서 draft.json.ds를 덮어 씌어줄 필요가 없음
      */
      // draft.json.ds = {...oldData, ...draft.json.ds}
      draft.json.nextNodeKey = "Function#17";
      break;
    }
    case "POST": {
      draft.json.nextNodeKey = "Flow#16";
      break;
    }
    default:
      draft.response.body = {
        errorMessage: `Unsupported http method ${request.method}`,
      };
      draft.json.terminateFlow = true;
      break;
  }
};
