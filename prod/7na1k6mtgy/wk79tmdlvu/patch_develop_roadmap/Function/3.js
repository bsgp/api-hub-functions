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

  const table = await file.get("config/commentsTables.json", {
    gziped: true,
    toJSON: true,
  });

  draft.pipe.json.validation = validation;
  draft.pipe.json.reqBody = body;
  draft.pipe.json.Data = data;
  draft.pipe.json.httpMethod = method;
  draft.pipe.json.table = table;
  draft.pipe.json.fileInfo = body.fileInfo;

  draft.response.body = {
    validation,
    method,
    table,
    data,
  };
};
