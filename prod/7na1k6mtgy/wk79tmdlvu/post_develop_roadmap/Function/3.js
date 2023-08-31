module.exports = async (draft, params) => {
  const { request, lib, file } = params;
  const { tryit } = lib;
  const { isFalsy } = lib.type;
  const method = request.method;

  const getFailedRes = (msg) => {
    draft.response.body = { E_STATUS: "F", E_MESSAGE: msg };
    draft.response.statusCode = 400;
  };
  if (isFalsy(tryit(() => request.body))) {
    getFailedRes("Body is required");
    return;
  }

  const body = tryit(() => request.body, {});
  let validation = true;
  if (typeof body !== "object") {
    validation = false;
    return getFailedRes("Typeof Body is wrong");
  }

  const data = body.Data;
  if (data.length === 0) {
    validation = false;
    return getFailedRes("Data is empty");
  }
  // if (data.length === 2 && isFalsy(data[1].file)) {
  //   validation = false;
  //   return getFailedRes("File data is empty");
  // }
  const mergedData = data.reduce((acc, cur) => {
    return { ...acc, ...cur };
  }, {});
  const Tables = body.Tables;
  const fileInfo = body.fileInfo;

  const table = await file.get("config/commentsTables.json", {
    gziped: true,
    toJSON: true,
  });

  draft.pipe.json.validation = validation;
  draft.pipe.json.reqBody = body;
  draft.pipe.json.Data = data;
  draft.pipe.json.httpMethod = method;
  draft.pipe.json.table = table;
  draft.pipe.json.Tables = JSON.stringify(Tables);
  draft.pipe.json.fileInfo = fileInfo;

  draft.response.body = {
    validation,
    method,
    table,
    data: mergedData,
  };
};
