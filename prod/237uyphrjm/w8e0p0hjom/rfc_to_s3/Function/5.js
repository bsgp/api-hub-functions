async function uploadCsv(data, key, { file, csv, athenaTableName }) {
  const csvData = csv.fromJson(data, { athenaString: true });
  const filePath = [athenaTableName, key]
    .filter(Boolean)
    .join("/")
    .concat(".csv");
  return await file.upload(filePath, csvData, {
    gzip: true,
    useCustomerRole: true,
    endsWithGz: true,
  });
}

// module.exports = async (draft, { request, file, csv }) => {
//   const athenaTableName = [draft.json.data.table, draft.json.data.dataset]
// .join(
//     "_"
//   );

//   if (draft.response.body.count > 0) {
//     if (request.body.RangeField) {
//       const dataParts = draft.response.body.list.reduce((acc, obj) => {
//         if (acc[obj[request.body.RangeField]] === undefined) {
//           acc[obj[request.body.RangeField]] = [];
//         }
//         acc[obj[request.body.RangeField]].push(obj);
//         return acc;
//       }, {});

//       for (let idx = 0; idx < Object.keys(dataParts).length; idx += 1) {
//         const key = Object.keys(dataParts)[idx];
//         await uploadCsv(dataParts[key], key, {
//           file,
//           csv,
//           draft,
//           athenaTableName,
//         });
//       }
//     } else {
//       await uploadCsv(draft.response.body.list, "", {
//         file,
//         csv,
//         draft,
//         athenaTableName,
//       });
//     }

//     // const csvData = csv.fromJson(draft.response.body.list);
//     // const filePath = [
//     //   request.body.TableName,
//     //   [
//     //     draft.json.run.rowSkips + 1,
//     //     draft.json.run.rowSkips + draft.response.body.count,
//     //   ].join("-"),
//     // ]
//     //   .join("/")
//     //   .concat(".csv");
//     // await file.upload(filePath, csvData, {
//     //   gzip: true,
//     //   useCustomerRole: true,
//     // });
//   }
// };

module.exports = async (draft, { request, file, csv, lib }) => {
  const { defined, tryit } = lib;
  const { athenaTableName, partitionKey, fileKey, output } = draft.json;

  const multiPKey = partitionKey.split("+");

  const dataParts = output.list.reduce((acc, obj) => {
    const objKey = [
      multiPKey
        .map((eachPKey) => {
          return defined(
            obj[eachPKey],
            tryit(() => request.body.Data[eachPKey])
          );
        })
        .filter(Boolean)
        .join(""),
    ]
      .concat([obj[fileKey] || "data"])
      .filter(Boolean)
      .join("/");
    if (acc[objKey] === undefined) {
      acc[objKey] = [];
    }
    acc[objKey].push(obj);
    return acc;
  }, {});

  const partKeys = Object.keys(dataParts);

  if (partKeys.length > 0) {
    draft.response.body = {
      all: partKeys.length,
      success: 0,
      failure: 0,
      failedData: [],
      count: output.list.length,
    };
  }

  for (let idx = 0; idx < partKeys.length; idx += 1) {
    const key = partKeys[idx];
    const value = dataParts[key];

    const thisUploadSucceed = await uploadCsv(value, key, {
      file,
      csv,
      athenaTableName,
    });

    if (thisUploadSucceed === true) {
      draft.response.body.success += 1;
    } else {
      draft.response.body.failure += 1;
      draft.response.body.failedData.push({ [key]: value });
    }
  }
};
