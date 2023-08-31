async function uploadCsv(
  data,
  key,
  { file, csv, draft, getSize, athenaTableName }
) {
  const csvData = csv.fromJson(data);
  const filePath = [
    athenaTableName,
    key,
    [
      draft.json.data.rowSkips + 1,
      draft.json.data.rowSkips + draft.response.body.count,
    ].join("-"),
  ]
    .filter(Boolean)
    .join("/")
    .concat(".csv");

  draft.response.body.bytesSize = getSize(csvData);

  await file.upload(filePath, csvData, {
    gzip: true,
    useCustomerRole: true,
    endsWithGz: true,
  });
}

module.exports = async (draft, { request, file, csv, lib }) => {
  const { getSize } = lib;
  const athenaTableName = [draft.json.data.table, draft.json.data.dataset].join(
    "_"
  );

  if (draft.response.body.count > 0) {
    if (request.body.RangeField) {
      const dataParts = draft.response.body.list.reduce((acc, obj) => {
        if (acc[obj[request.body.RangeField]] === undefined) {
          acc[obj[request.body.RangeField]] = [];
        }
        acc[obj[request.body.RangeField]].push(obj);
        return acc;
      }, {});

      for (let idx = 0; idx < Object.keys(dataParts).length; idx += 1) {
        const key = Object.keys(dataParts)[idx];
        await uploadCsv(dataParts[key], key, {
          file,
          csv,
          draft,
          getSize,
          athenaTableName,
        });
      }
    } else {
      await uploadCsv(draft.response.body.list, "", {
        file,
        csv,
        draft,
        getSize,
        athenaTableName,
      });
    }

    // const csvData = csv.fromJson(draft.response.body.list);
    // const filePath = [
    //   request.body.TableName,
    //   [
    //     draft.json.run.rowSkips + 1,
    //     draft.json.run.rowSkips + draft.response.body.count,
    //   ].join("-"),
    // ]
    //   .join("/")
    //   .concat(".csv");
    // await file.upload(filePath, csvData, {
    //   gzip: true,
    //   useCustomerRole: true,
    // });
  }
};
