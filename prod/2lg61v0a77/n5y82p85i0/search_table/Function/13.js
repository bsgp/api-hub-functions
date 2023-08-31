module.exports = async (draft, { request, file, task, lib }) => {
  const { isNumber } = lib;
  const groupId = [request.flowId, request.body.TableName].join("/");
  const fileName = groupId.concat(".json");
  let data;

  draft.json.countPerTime = 1000;

  switch (request.method) {
    case "DELETE": {
      let succeedToMove = true;
      try {
        succeedToMove = await file.move(
          fileName,
          ["deleted", fileName].join("/")
        );
      } catch (ex) {
        succeedToMove = false;
      }

      if (succeedToMove) {
        draft.response.body = {
          message: `Run for Table ${request.body.TableName} is deleted`,
        };
      } else {
        draft.response.body = {
          message: `Run for Table ${request.body.TableName} does not exist`,
        };
      }

      draft.json.terminateFlow = true;

      break;
    }
    case "GET":
      try {
        data = await file.get(fileName, {
          gziped: true,
          toJSON: true,
          ignoreEfs: true,
        });
      } catch (ex) {
        draft.response.body = {
          message: `Run for Table ${request.body.TableName} does not exist`,
        };
        draft.json.terminateFlow = true;
        return;
      }

      draft.response.body = {
        message: `Querying from ${data.rowSkips + 1} to ${
          data.rowSkips + data.rowCount
        } records`,
        ...data,
      };
      draft.json.terminateFlow = true;
      break;
    case "POST":
      data = {
        fileName,
        status: "Started",
        rowCount: request.body.RowCount || draft.json.countPerTime,
        rowSkips: request.body.RowSkips || 0,
        totalCount: 0,
        totalDuration: 0,
        retryCount: 0,
      };
      if (!isNumber(request.body.Retry)) {
        draft.json.run = data;
        return;
      }

      try {
        data = await file.get(fileName, {
          gziped: true,
          toJSON: true,
          ignoreEfs: true,
        });

        draft.response.body = {
          message: `Run for Table ${request.body.TableName} is running`,
        };
        draft.json.terminateFlow = true;
        return;
      } catch (ex) {
        await file.upload(fileName, data, { gzip: true });
      }

      await task.create(
        groupId.toLowerCase(),
        request.flowId,
        request.qualifier,
        request.body
      );

      draft.response.body = {
        message: `Run for Table ${request.body.TableName} is started`,
      };
      draft.json.terminateFlow = true;
      break;
    case "TASK":
      try {
        data = await file.get(fileName, {
          gziped: true,
          toJSON: true,
          ignoreEfs: true,
        });
      } catch (ex) {
        draft.response.body = {
          message: `Run for Table ${request.body.TableName} does not exist`,
        };
        draft.json.terminateFlow = true;
        return;
      }

      if (["WaitForNext"].includes(data.status)) {
        data.rowSkips += data.rowCount;
        await file.upload(fileName, data, { gzip: true });
      }

      draft.json.run = data;
      break;
    default:
      draft.response.body = { message: `Unsupported Method:${request.method}` };
      draft.json.terminateFlow = true;
      break;
  }
};
