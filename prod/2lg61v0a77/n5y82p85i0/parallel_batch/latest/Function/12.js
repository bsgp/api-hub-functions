module.exports = async (draft, { request, lib, dynamodb }) => {
  const { clone, isFalsy, isTruthy } = lib;

  if (isFalsy(request.body.TableName) && isTruthy(request.requestBody)) {
    request.body = clone(request.requestBody);
  }

  // Only one Dataset can run at same time.
  draft.json.ds = {
    table: request.body.TableName.toLowerCase(),
    dataset: request.body.DataSetName.toLowerCase(),
    version: "1",
    currentBatchCount: 0,
    rowsCount: 0,
    finishedBatchCount: 0,
  };

  switch (request.method) {
    case "GET":
      draft.json.nextNodeKey = "Function#13";
      draft.json.ds.version = request.body.Version.toLowerCase();
      break;
    case "TASK": {
      /* 20221006 
        version으로 조건을 했을 경우, 
        1. 최초 TASK 실행 시 version = 1이므로 POST flow 실행
        2. function#18에서 version에 대한 업데이트를 진행
        3. batch_query_data에서 parallel_batch 호출 시 version은 업데이트가 되어 TASK flow 실행
      */

      const data = await dynamodb.getItem("etl_ds", {
        tb: draft.json.ds.table,
        id: draft.json.ds.dataset,
      });

      if (
        request.body.requestFrom === "Scheduler" &&
        parseInt(data.version) === 1
      ) {
        draft.json.nextNodeKey = "Function#18";
      } else {
        draft.json.ds = clone(data);
        draft.json.nextNodeKey = "Function#14";
      }
      break;
    }
    case "POST": {
      draft.json.nextNodeKey = "Function#18";
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
