module.exports = async (draft, { request, file, lib }) => {
  const { tryit } = lib;
  const fileName = draft.json.fileName;
  const groupId = draft.json.groupId;

  const data = await tryit(() =>
    file.get(fileName, {
      gziped: true,
      toJSON: true,
      ignoreEfs: true,
    })
  );
  if (data === undefined) {
    draft.response.body = {
      message: [
        "Batch",
        request.body.BatchName,
        "for Table/DataSet",
        groupId,
        "does not exist",
      ].join(" "),
    };
    return;
  }

  data.deletedAt = new Date();
  await file.upload(fileName, data, { gzip: true });

  await file.move(fileName, ["deleted", data.id].join("/").concat(".json"));

  draft.response.body = {
    message: [
      "Batch",
      request.body.BatchName,
      "for Table/DataSet",
      groupId,
      "is deleted",
    ].join(" "),
  };
};
