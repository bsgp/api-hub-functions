module.exports = async (draft, { request, file, task, lib }) => {
  const { isNumber } = lib;
  if (request.method === "POST" && !isNumber(request.body.Retry)) {
    return;
  }

  const groupId = [request.flowId, request.body.TableName].join("/");
  const fileName = groupId.concat(".json");
  let data;

  try {
    data = await file.get(fileName, {
      gziped: true,
      toJSON: true,
      ignoreEfs: true,
    });
  } catch (ex) {
    draft.response.body.message = [
      "Run for Table",
      request.body.TableName,
      "does not exist",
    ].join(" ");
    return;
  }

  if (
    draft.response.body.count < draft.json.run.rowCount ||
    (isNumber(request.body.Retry) && request.body.Retry === data.retryCount)
  ) {
    data.status = "Finished";
    draft.response.body.message = [
      "Run for Table",
      request.body.TableName,
      "is finished",
    ].join(" ");

    data.errorMessage = draft.response.body.errorMessage;
    data.totalCount += draft.response.body.count;
    data.totalDuration += new Date() - new Date(data.startTime);
    await file.upload(fileName, data, { gzip: true });

    await file.move(
      fileName,
      ["archived", ...request.requestTime, fileName].join("/")
    );
  } else {
    data.status = "WaitForNext";

    data.retryCount += 1;
    data.totalCount += draft.response.body.count;
    data.totalDuration += new Date() - new Date(data.startTime);
    await file.upload(fileName, data, { gzip: true });

    await task.create(
      groupId.toLowerCase(),
      request.flowId,
      request.qualifier,
      request.body
    );
  }
};
