module.exports = async (draft, { dynamodb, lib, request }) => {
  const { clone } = lib;
  // const fileName = draft.json.fileName;
  // const groupId = draft.json.groupId;

  // const data = await tryit(() =>
  //   file.get(fileName, {
  //     gziped: true,
  //     toJSON: true,
  //     ignoreEfs: true,
  //   })
  // );
  const batchData = await dynamodb.getItem("etl_batch", {
    tbds: draft.json.data.tbds,
    id: draft.json.data.id,
  });

  if (batchData === undefined) {
    draft.response.body = {
      message: [
        "Batch",
        draft.json.data.id,
        "for Table/DataSet",
        draft.json.data.tbds,
        "does not exist",
      ].join(" "),
    };
    draft.json.terminateFlow = true;
    return;
  }

  draft.json.data = {
    ...draft.json.data,
    ...batchData,
  };

  draft.json.lastStartedAt = new Date();

  draft.json.taskReqBody = clone(request.body);
  draft.json.taskReqBody.RowCount = draft.json.data.rowCount;
  draft.json.taskReqBody.RowSkips = draft.json.data.rowSkips;

  // await file.upload(fileName, data, { gzip: true });
  // await dynamodb.updateItem(
  //   "etl_batch",
  //   {
  //     tbds: draft.json.data.tbds,
  //     id: draft.json.data.id,
  //   },
  //   data
  // );
  //
  // draft.json.run = data;
};
