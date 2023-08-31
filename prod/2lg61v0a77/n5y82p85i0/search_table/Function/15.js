module.exports = async (draft, { request, file }) => {
  if (draft.response.body.count > 0) {
    const filePath = [
      request.body.AthenaTableName,
      [
        draft.json.run.rowSkips + 1,
        draft.json.run.rowSkips + draft.response.body.count,
      ].join("-"),
    ]
      .join("/")
      .concat(".json");
    await file.upload(filePath, draft.response.body.list, {
      gzip: true,
      useCustomerRole: true,
    });
  }
};
