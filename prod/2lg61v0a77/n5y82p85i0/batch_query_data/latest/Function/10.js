module.exports = async (draft, { dynamodb, lib, request }) => {
  const { clone } = lib;

  const batchData = await dynamodb.getItem("etl_batch", {
    tbds: draft.json.data.tbds,
    id: draft.json.data.batch,
  });

  if (batchData === undefined) {
    draft.response.body = {
      message: [
        "Batch",
        draft.json.data.batch,
        "for Table/DataSet",
        draft.json.data.tbds,
        "does not exist",
      ].join(" "),
    };
    draft.json.terminateFlow = true;
    return;
  }

  // 221015 total count 덮어 씌우기
  draft.json.data = {
    ...draft.json.data,
    ...batchData,
  };

  draft.json.lastStartedAt = new Date();

  draft.json.taskReqBody = clone(request.body);
  draft.json.taskReqBody.RowCount = draft.json.data.rowCount;
  draft.json.taskReqBody.RowSkips = draft.json.data.rowSkips;
};
