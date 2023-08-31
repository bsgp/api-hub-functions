module.exports = async (draft, { request, dynamodb }) => {
  draft.json.data = {
    table: request.body.TableName.toLowerCase(),
    dataset: request.body.DataSetName.toLowerCase(),
    batch: request.body.BatchName.toLowerCase(),
  };
  draft.json.data.tbds = [draft.json.data.table, draft.json.data.dataset].join(
    "/"
  );

  draft.json.countPerTime = 1000;
  console.log(JSON.stringify(draft.response), "response in function4");
  // console.log(JSON.stringify(request), "request in function4");
  switch (request.method) {
    case "DELETE":
      draft.json.nextNodeKey = "Function#8";
      break;
    case "GET":
      draft.json.nextNodeKey = "Function#7";
      break;
    case "POST":
      draft.json.nextNodeKey = "Function#9";
      break;
    case "TASK": {
      /* 
      221006 
      parallel_batch의 Flow#6의 method는 $json.method로 되어 있어 TASK로 들어오고 있음
      배치 생성 후 TASK flow가 실행되어야 하는데, 배치 생성 전 TASK가 실행되어 
      Batch 2_20220817 for Table/DataSet mara/221006-4-v7 does not exist 이슈 출력
      */
      const batchData = await dynamodb.getItem("etl_batch", {
        tbds: draft.json.data.tbds,
        id: draft.json.data.batch,
      });
      if (batchData === undefined) {
        draft.json.nextNodeKey = "Function#9";
      } else {
        draft.json.nextNodeKey = "Function#10";
      }
      break;
    }
    default:
      draft.response.body = {
        errorMessage: `Unsupported Method:${request.method}`,
      };
      draft.json.terminateFlow = true;
      break;
  }
};
